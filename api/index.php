<?php
declare(strict_types=1);

require __DIR__ . '/config.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

$action = $_GET['action'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

try {
    match ($action) {
        'register' => register_user(),
        'login' => login_user(),
        'update-profile' => update_profile(),
        'delete-account' => delete_account(),
        'listings' => $method === 'GET' ? get_listings() : create_listing(),
        'update-listing' => update_listing(),
        'delete-listing' => delete_listing(),
        'checkout' => checkout(),
        'orders' => get_orders(),
        'roles' => get_roles(),
        'users' => get_users(),
        'reports' => $method === 'GET' ? get_reports() : save_report(),
        'save-role' => save_role(),
        'delete-role' => delete_role(),
        'save-user' => save_user(),
        'suspend-user' => suspend_user(),
        'ban-user' => ban_user(),
        'resolve-report' => resolve_report(),
        'delete-user' => delete_user(),
        default => json_response(['success' => false, 'message' => 'Unknown API action.'], 404),
    };
} catch (Throwable $error) {
    json_response(['success' => false, 'message' => $error->getMessage()], 500);
}

function register_user(): void
{
    $data = request_body();
    require_fields($data, ['fullName', 'email', 'phone', 'location', 'password']);

    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        json_response(['success' => false, 'message' => 'Invalid email address.'], 422);
    }

    if (!preg_match('/^[0-9]{10}$/', $data['phone'])) {
        json_response(['success' => false, 'message' => 'Phone number must be 10 digits.'], 422);
    }

    $email = strtolower(trim($data['email']));
    $banStmt = db()->prepare('SELECT COUNT(*) FROM banned_emails WHERE email = ?');
    $banStmt->execute([$email]);

    if ((int) $banStmt->fetchColumn() > 0) {
        json_response(['success' => false, 'message' => 'This email address is blocked from creating a new account.'], 403);
    }

    $roleKey = 'seller';
    $idNumber = trim((string) ($data['idNumber'] ?? ''));
    $verified = preg_match('/^[0-9A-Za-z]{6,30}$/', $idNumber);

    try {
        $stmt = db()->prepare('INSERT INTO users (full_name, email, phone, location, password_hash, role_key, seller_type, id_number, preferred_language, verified, member_since) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([
            trim($data['fullName']),
            $email,
            trim($data['phone']),
            trim($data['location']),
            password_hash($data['password'], PASSWORD_DEFAULT),
            $roleKey,
            trim((string) ($data['sellerType'] ?? 'Student reseller')),
            $idNumber,
            trim((string) ($data['preferredLanguage'] ?? 'English')),
            $verified ? 1 : 0,
            date('F Y'),
        ]);
    } catch (PDOException $error) {
        if ($error->getCode() === '23000') {
            json_response(['success' => false, 'message' => 'This email is already registered.'], 409);
        }

        throw $error;
    }

    $user = db()->query('SELECT * FROM users WHERE id = ' . (int) db()->lastInsertId())->fetch();
    json_response(['success' => true, 'user' => user_public($user)]);
}

function login_user(): void
{
    $data = request_body();
    require_fields($data, ['email', 'password']);

    $identifier = strtolower(trim((string) $data['email']));
    $stmt = db()->prepare('SELECT * FROM users WHERE email = ? OR (? = "admin" AND role_key = "admin") ORDER BY id LIMIT 1');
    $stmt->execute([$identifier, $identifier]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($data['password'], $user['password_hash'])) {
        json_response(['success' => false, 'message' => 'Email or password is incorrect.'], 401);
    }

    json_response(['success' => true, 'user' => user_public($user)]);
}

function update_profile(): void
{
    $data = request_body();
    require_fields($data, ['id', 'fullName', 'email', 'phone', 'location']);

    $idNumber = trim((string) ($data['idNumber'] ?? ''));
    $verified = preg_match('/^[0-9A-Za-z]{6,30}$/', $idNumber);
    $stmt = db()->prepare('UPDATE users SET full_name = ?, email = ?, phone = ?, location = ?, seller_type = ?, id_number = ?, preferred_language = ?, verified = ? WHERE id = ?');
    $stmt->execute([
        trim($data['fullName']),
        strtolower(trim($data['email'])),
        trim($data['phone']),
        trim($data['location']),
        trim((string) ($data['sellerType'] ?? 'Student reseller')),
        $idNumber,
        trim((string) ($data['preferredLanguage'] ?? 'English')),
        $verified ? 1 : 0,
        (int) $data['id'],
    ]);

    $stmt = db()->prepare('SELECT * FROM users WHERE id = ?');
    $stmt->execute([(int) $data['id']]);
    json_response(['success' => true, 'user' => user_public($stmt->fetch())]);
}

function delete_account(): void
{
    $data = request_body();
    require_fields($data, ['id']);

    $stmt = db()->prepare('DELETE FROM users WHERE id = ?');
    $stmt->execute([(int) $data['id']]);
    json_response(['success' => true]);
}

function get_listings(): void
{
    $rows = db()->query('SELECT listings.*, users.email AS seller_email, users.verified AS seller_verified FROM listings LEFT JOIN users ON listings.seller_id = users.id ORDER BY listings.created_at DESC')->fetchAll();
    $listings = array_map(fn ($row) => [
        'id' => (int) $row['id'],
        'sellerId' => $row['seller_id'] ? (int) $row['seller_id'] : null,
        'sellerEmail' => $row['seller_email'],
        'sellerVerified' => (bool) $row['seller_verified'],
        'name' => $row['name'],
        'brand' => $row['brand'] ?? '',
        'price' => (float) $row['price'],
        'category' => $row['category'],
        'condition' => $row['item_condition'] ?? 'Good',
        'location' => $row['location'],
        'deliveryOptions' => $row['delivery_options'] ?? 'Meet seller',
        'image' => $row['image'],
        'description' => $row['description'],
    ], $rows);

    json_response(['success' => true, 'listings' => $listings]);
}

function create_listing(): void
{
    $data = request_body();
    require_fields($data, ['name', 'price', 'category', 'location', 'description']);

    $stmt = db()->prepare('INSERT INTO listings (seller_id, name, brand, price, category, item_condition, location, delivery_options, image, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([
        $data['sellerId'] ?? null,
        trim($data['name']),
        trim((string) ($data['brand'] ?? '')),
        (float) $data['price'],
        trim($data['category']),
        trim((string) ($data['condition'] ?? 'Good')),
        trim($data['location']),
        trim((string) ($data['deliveryOptions'] ?? 'Meet seller')),
        $data['image'] ?? '',
        trim($data['description']),
    ]);

    json_response(['success' => true, 'id' => (int) db()->lastInsertId()]);
}

function update_listing(): void
{
    $data = request_body();
    require_fields($data, ['id', 'name', 'price', 'category', 'location', 'description']);

    $stmt = db()->prepare('UPDATE listings SET name = ?, brand = ?, price = ?, category = ?, item_condition = ?, location = ?, delivery_options = ?, image = ?, description = ? WHERE id = ?');
    $stmt->execute([
        trim($data['name']),
        trim((string) ($data['brand'] ?? '')),
        (float) $data['price'],
        trim($data['category']),
        trim((string) ($data['condition'] ?? 'Good')),
        trim($data['location']),
        trim((string) ($data['deliveryOptions'] ?? 'Meet seller')),
        $data['image'] ?? '',
        trim($data['description']),
        (int) $data['id'],
    ]);

    json_response(['success' => true]);
}

function delete_listing(): void
{
    $data = request_body();
    require_fields($data, ['id']);

    $stmt = db()->prepare('DELETE FROM listings WHERE id = ?');
    $stmt->execute([(int) $data['id']]);
    json_response(['success' => true]);
}

function checkout(): void
{
    $data = request_body();
    require_fields($data, ['customer', 'delivery', 'address', 'payment', 'items', 'total']);

    $orderNumber = 'HH' . time();
    $customer = $data['customer'];
    $paymentStatus = in_array($data['payment'], ['PayFast secure checkout', 'Ozow instant EFT'], true) ? 'Payment gateway selected' : 'Pending';
    $stmt = db()->prepare('INSERT INTO orders (order_number, customer_id, customer_name, customer_email, customer_phone, delivery_option, address, payment_method, payment_status, dispute_status, total) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([
        $orderNumber,
        $data['customerId'] ?? null,
        $customer['fullName'],
        $customer['email'],
        $customer['phone'],
        $data['delivery'],
        $data['address'],
        $data['payment'],
        $paymentStatus,
        'None',
        (float) $data['total'],
    ]);

    $orderId = (int) db()->lastInsertId();
    $itemStmt = db()->prepare('INSERT INTO order_items (order_id, product_name, product_price, quantity) VALUES (?, ?, ?, ?)');

    foreach ($data['items'] as $item) {
        $itemStmt->execute([$orderId, $item['name'], (float) $item['price'], $item['quantity'] ?? 1]);
    }

    json_response(['success' => true, 'orderNumber' => $orderNumber]);
}

function get_orders(): void
{
    $rows = db()->query('SELECT * FROM orders ORDER BY created_at DESC')->fetchAll();
    $itemStmt = db()->prepare('SELECT product_name, product_price, quantity FROM order_items WHERE order_id = ? ORDER BY id');

    $orders = array_map(function ($row) use ($itemStmt) {
        $itemStmt->execute([(int) $row['id']]);
        $items = array_map(fn ($item) => [
            'name' => $item['product_name'],
            'price' => (float) $item['product_price'],
            'quantity' => (int) $item['quantity'],
        ], $itemStmt->fetchAll());

        return [
            'id' => (int) $row['id'],
            'orderNumber' => $row['order_number'],
            'customerId' => $row['customer_id'] ? (int) $row['customer_id'] : null,
            'customer' => [
                'fullName' => $row['customer_name'],
                'email' => $row['customer_email'],
                'phone' => $row['customer_phone'],
            ],
            'delivery' => $row['delivery_option'],
            'address' => $row['address'],
            'payment' => $row['payment_method'],
            'paymentStatus' => $row['payment_status'],
            'disputeStatus' => $row['dispute_status'],
            'items' => $items,
            'total' => (float) $row['total'],
            'date' => $row['created_at'],
        ];
    }, $rows);

    json_response(['success' => true, 'orders' => $orders]);
}

function get_roles(): void
{
    $roles = db()->query('SELECT role_key AS id, name, description, permissions FROM roles ORDER BY name')->fetchAll();
    foreach ($roles as &$role) {
        $role['permissions'] = array_filter(explode(',', $role['permissions']));
    }
    json_response(['success' => true, 'roles' => $roles]);
}

function get_users(): void
{
    $users = db()->query('SELECT * FROM users ORDER BY created_at DESC')->fetchAll();
    json_response(['success' => true, 'users' => array_map('user_public', $users)]);
}

function save_role(): void
{
    $data = request_body();
    require_fields($data, ['id', 'name', 'description', 'permissions']);

    $stmt = db()->prepare('INSERT INTO roles (role_key, name, description, permissions) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description), permissions = VALUES(permissions)');
    $stmt->execute([
        $data['id'],
        trim($data['name']),
        trim($data['description']),
        implode(',', $data['permissions']),
    ]);

    json_response(['success' => true]);
}

function delete_role(): void
{
    $data = request_body();
    require_fields($data, ['id']);

    if (in_array($data['id'], ['admin', 'seller', 'customer'], true)) {
        json_response(['success' => false, 'message' => 'Core user types cannot be deleted.'], 422);
    }

    $stmt = db()->prepare('DELETE FROM roles WHERE role_key = ?');
    $stmt->execute([$data['id']]);
    json_response(['success' => true]);
}

function save_user(): void
{
    $data = request_body();
    require_fields($data, ['fullName', 'email', 'phone', 'location', 'roleId']);

    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL) || !preg_match('/^[0-9]{10}$/', $data['phone'])) {
        json_response(['success' => false, 'message' => 'Invalid email or phone number.'], 422);
    }

    if (!empty($data['id'])) {
        if (!empty($data['password'])) {
            $stmt = db()->prepare('UPDATE users SET full_name = ?, email = ?, phone = ?, location = ?, role_key = ?, password_hash = ?, account_status = ? WHERE id = ?');
            $stmt->execute([
                trim($data['fullName']),
                strtolower(trim($data['email'])),
                trim($data['phone']),
                trim($data['location']),
                $data['roleId'],
                password_hash($data['password'], PASSWORD_DEFAULT),
                $data['accountStatus'] ?? 'active',
                (int) $data['id'],
            ]);
        } else {
            $stmt = db()->prepare('UPDATE users SET full_name = ?, email = ?, phone = ?, location = ?, role_key = ?, account_status = ? WHERE id = ?');
            $stmt->execute([
                trim($data['fullName']),
                strtolower(trim($data['email'])),
                trim($data['phone']),
                trim($data['location']),
                $data['roleId'],
                $data['accountStatus'] ?? 'active',
                (int) $data['id'],
            ]);
        }
    } else {
        $stmt = db()->prepare('INSERT INTO users (full_name, email, phone, location, password_hash, role_key, member_since, account_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([
            trim($data['fullName']),
            strtolower(trim($data['email'])),
            trim($data['phone']),
            trim($data['location']),
            password_hash($data['password'] ?? 'password123', PASSWORD_DEFAULT),
            $data['roleId'],
            $data['memberSince'] ?? date('F Y'),
            $data['accountStatus'] ?? 'active',
        ]);
    }

    json_response(['success' => true]);
}

function get_reports(): void
{
    $rows = db()->query('SELECT * FROM reports ORDER BY created_at DESC')->fetchAll();
    $reports = array_map(fn ($row) => [
        'id' => (int) $row['id'],
        'productId' => $row['product_id'],
        'productName' => $row['product_name'],
        'sellerEmail' => $row['seller_email'],
        'reporterEmail' => $row['reporter_email'],
        'reason' => $row['reason'],
        'status' => $row['status'],
        'createdAt' => $row['created_at'],
    ], $rows);

    json_response(['success' => true, 'reports' => $reports]);
}

function save_report(): void
{
    $data = request_body();
    require_fields($data, ['productName', 'reason']);

    $stmt = db()->prepare('INSERT INTO reports (product_id, product_name, seller_email, reporter_email, reason, status) VALUES (?, ?, ?, ?, ?, ?)');
    $stmt->execute([
        (string) ($data['productId'] ?? ''),
        trim($data['productName']),
        strtolower(trim((string) ($data['sellerEmail'] ?? ''))),
        strtolower(trim((string) ($data['reporterEmail'] ?? ''))),
        trim($data['reason']),
        $data['status'] ?? 'open',
    ]);

    json_response(['success' => true, 'id' => (int) db()->lastInsertId()]);
}

function resolve_report(): void
{
    $data = request_body();
    require_fields($data, ['id', 'status']);

    $stmt = db()->prepare('UPDATE reports SET status = ? WHERE id = ?');
    $stmt->execute([$data['status'], (int) $data['id']]);
    json_response(['success' => true]);
}

function suspend_user(): void
{
    $data = request_body();
    require_fields($data, ['email']);

    $stmt = db()->prepare('UPDATE users SET account_status = ? WHERE email = ?');
    $stmt->execute(['suspended', strtolower(trim($data['email']))]);
    json_response(['success' => true]);
}

function ban_user(): void
{
    $data = request_body();
    require_fields($data, ['email']);

    $email = strtolower(trim($data['email']));
    $reason = trim((string) ($data['reason'] ?? 'Banned by admin.'));
    $banStmt = db()->prepare('INSERT INTO banned_emails (email, reason) VALUES (?, ?) ON DUPLICATE KEY UPDATE reason = VALUES(reason)');
    $banStmt->execute([$email, $reason]);

    $userStmt = db()->prepare('SELECT id FROM users WHERE email = ?');
    $userStmt->execute([$email]);
    $userId = $userStmt->fetchColumn();

    if ($userId) {
        $listingStmt = db()->prepare('DELETE FROM listings WHERE seller_id = ?');
        $listingStmt->execute([(int) $userId]);
    }

    $deleteStmt = db()->prepare('DELETE FROM users WHERE email = ?');
    $deleteStmt->execute([$email]);
    json_response(['success' => true]);
}

function delete_user(): void
{
    $data = request_body();
    require_fields($data, ['id']);

    $stmt = db()->prepare('DELETE FROM users WHERE id = ?');
    $stmt->execute([(int) $data['id']]);
    json_response(['success' => true]);
}

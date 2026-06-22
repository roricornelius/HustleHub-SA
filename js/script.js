document.addEventListener("DOMContentLoaded", function () {
    runPageSetup(seedStarterUsers, "seed starter users");

    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");
    const sellForm = document.getElementById("sellForm");

    if (registerForm) {
        registerForm.addEventListener("submit", handleRegister);
    }

    if (loginForm) {
        loginForm.addEventListener("submit", handleLogin);
    }

    if (sellForm) {
        sellForm.addEventListener("submit", handleSellListing);
        setupPhotoSourceToggle(sellForm);
        setupSellFormEdit(sellForm);
    }

    runPageSetup(setupProfileActions, "profile actions");
    runPageSetup(loadProfileDetails, "profile details");
    runPageSetup(loadSavedListings, "saved listings");
    runPageSetup(loadMyListings, "my listings");
    runPageSetup(loadProfileCart, "profile cart");
    runPageSetup(loadPublicProfileListings, "public profile listings");
    runPageSetup(loadMarketplaceStats, "marketplace stats");
    runPageSetup(setupMarketplaceDiscovery, "marketplace discovery");
    runPageSetup(setupProductSearch, "product search");
    runPageSetup(setupMarketplaceFilters, "marketplace filters");
    runPageSetup(setupUserSearch, "user search");
    runPageSetup(setupListingDelete, "listing actions");
    runPageSetup(updateNavbarForLoginState, "navbar");
    runPageSetup(setupWelcomeMessage, "welcome message");
    runPageSetup(setupProductActions, "product actions");
    runPageSetup(loadFavoriteListings, "favorite listings");
    runPageSetup(loadProfileRatings, "profile ratings");
    runPageSetup(loadFollowingList, "following list");
    runPageSetup(setupPublicProfile, "public profile actions");
    runPageSetup(setupMessagesPage, "messages page");
    runPageSetup(setupNotificationsPage, "notifications page");
});

function runPageSetup(callback, label) {
    try {
        const result = callback();

        if (result && typeof result.catch === "function") {
            result.catch(function (error) {
                console.warn("HustleHub setup skipped: " + label, error);
            });
        }
    } catch (error) {
        console.warn("HustleHub setup skipped: " + label, error);
    }
}

const STARTER_ADMIN_USER = {
    id: 1,
    fullName: "Admin User",
    email: "admin@hustlehub.co.za",
    phone: "0710000000",
    location: "Gauteng",
    roleId: "admin",
    sellerType: "Platform administrator",
    idNumber: "ADMIN001",
    preferredLanguage: "English",
    verified: true,
    password: "admin123",
    memberSince: "May 2026",
    bio: "HustleHub SA platform administrator.",
    avatar: "",
    avatarPosition: { x: 50, y: 50 },
    lastActive: new Date().toISOString()
};

const STARTER_DEMO_SELLER = {
    id: 2,
    fullName: "HustleHub Demo Seller",
    email: "demo@hustlehub.co.za",
    phone: "0720000000",
    location: "Western Cape",
    roleId: "seller",
    sellerType: "Student reseller",
    idNumber: "SELLER001",
    preferredLanguage: "English",
    verified: true,
    password: "seller123",
    memberSince: "May 2026",
    bio: "Demo seller for built-in marketplace items.",
    avatar: "",
    avatarPosition: { x: 50, y: 50 },
    lastActive: new Date().toISOString()
};

const BUILT_IN_PRODUCTS = [
    { id: "product1", name: "Adidas Sneakers", price: 700, image: "images/item1.jpg", link: "product1.html", category: "Fashion", brand: "Adidas", condition: "Very Good", sellerEmail: "demo@hustlehub.co.za", sellerVerified: true, deliveryOptions: "Campus pickup, Courier delivery", location: "Cape Town" },
    { id: "product2", name: "Leather Jacket", price: 2500, image: "images/item2.jpg", link: "product2.html", category: "Fashion", brand: "Vintage", condition: "Very Good", sellerEmail: "demo@hustlehub.co.za", sellerVerified: true, deliveryOptions: "Meet seller, Pickup point", location: "Johannesburg" },
    { id: "product3", name: "Backpack", price: 300, image: "images/item3.jpg", link: "product3.html", category: "Books", brand: "Cotton On", condition: "Good", sellerEmail: "demo@hustlehub.co.za", sellerVerified: true, deliveryOptions: "Campus pickup", location: "Cape Town" },
    { id: "product4", name: "Apple MacBook Pro", price: 6500, image: "images/item4.jpg", link: "product4.html", category: "Tech", brand: "Apple", condition: "Like New", sellerEmail: "demo@hustlehub.co.za", sellerVerified: true, deliveryOptions: "Courier delivery", location: "Hermanus" },
    { id: "product5", name: "Sony Headphones", price: 3000, image: "images/item5.jpg", link: "product5.html", category: "Tech", brand: "Sony", condition: "Very Good", sellerEmail: "demo@hustlehub.co.za", sellerVerified: true, deliveryOptions: "Pickup point, Courier delivery", location: "Durban" },
    { id: "product6", name: "Apple Watch", price: 5000, image: "images/item6.jpg", link: "product6.html", category: "Tech", brand: "Apple", condition: "Very Good", sellerEmail: "demo@hustlehub.co.za", sellerVerified: true, deliveryOptions: "Meet seller", location: "Cape Town" },
    { id: "product7", name: "PS5 Game Console", price: 12000, image: "images/item7.jpg", link: "product7.html", category: "Tech", brand: "Sony", condition: "Very Good", sellerEmail: "demo@hustlehub.co.za", sellerVerified: true, deliveryOptions: "Courier delivery", location: "Cape Town" },
    { id: "product8", name: "Corduroy Pants", price: 400, image: "images/item8.jpg", link: "product8.html", category: "Fashion", brand: "Zara", condition: "Very Good", sellerEmail: "demo@hustlehub.co.za", sellerVerified: true, deliveryOptions: "Campus pickup, Meet seller", location: "Cape Town" }
];

function seedStarterUsers() {
    const users = getStoredUsers();
    const hasAdmin = users.some(function (user) {
        return user.email === STARTER_ADMIN_USER.email;
    });
    const normalizedUsers = users.map(function (user) {
        return {
            ...user,
        roleId: user.roleId || "customer",
        sellerType: user.sellerType || (user.roleId === "seller" ? "Student reseller" : "Buyer"),
        preferredLanguage: user.preferredLanguage || "English",
        verified: Boolean(user.verified),
        avatar: user.avatar || "",
            avatarPosition: normalizeAvatarPosition(user.avatarPosition),
            bio: user.bio || ""
        };
    });

    if (!hasAdmin) {
        normalizedUsers.unshift(STARTER_ADMIN_USER);
    }

    if (!normalizedUsers.some(function (user) { return user.email === STARTER_DEMO_SELLER.email; })) {
        normalizedUsers.push(STARTER_DEMO_SELLER);
    }

    localStorage.setItem("hustleHubUsers", JSON.stringify(normalizedUsers));
}

async function handleRegister(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const message = document.getElementById("registerMessage");
    const fullName = form.fullName.value.trim();
    const email = form.email.value.trim().toLowerCase();
    const phone = form.phone.value.trim();
    const location = form.location.value;
    const accountType = form.accountType ? form.accountType.value : "customer";
    const sellerType = form.sellerType ? form.sellerType.value : "Buyer";
    const preferredLanguage = form.preferredLanguage ? form.preferredLanguage.value : "English";
    const idNumber = form.idNumber ? form.idNumber.value.trim() : "";
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    form.email.setCustomValidity("");
    form.phone.setCustomValidity("");
    form.confirmPassword.setCustomValidity("");

    validateEmailField(form.email);
    validatePhoneField(form.phone);

    if (password !== confirmPassword) {
        form.confirmPassword.setCustomValidity("Passwords do not match.");
    }

    if (!form.checkValidity()) {
        form.classList.add("was-validated");
        showRegisterMessage("Please fix the highlighted fields.", "danger");
        return;
    }

    const users = getStoredUsers();
    const emailExists = users.some(function (user) {
        return user.email === email;
    });

    if (emailExists) {
        form.email.setCustomValidity("This email is already registered.");
        form.classList.add("was-validated");
        showRegisterMessage("An account with this email already exists.", "warning");
        return;
    }

    const newUser = {
        id: Date.now(),
        fullName: fullName,
        email: email,
        phone: phone,
        location: location,
        roleId: accountType === "seller" ? "seller" : "customer",
        sellerType: sellerType,
        idNumber: idNumber,
        preferredLanguage: preferredLanguage,
        verified: accountType === "seller" && idNumber.length >= 6,
        password: password,
        memberSince: new Date().toLocaleDateString("en-ZA", {
            month: "long",
            year: "numeric"
        }),
        avatar: "",
        avatarPosition: { x: 50, y: 50 },
        bio: "",
        lastActive: new Date().toISOString()
    };

    let savedUser = newUser;

    if (typeof apiRequest === "function") {
        try {
            const response = await apiRequest("register", {
                fullName: fullName,
                email: email,
                phone: phone,
                location: location,
                accountType: accountType,
                sellerType: sellerType,
                preferredLanguage: preferredLanguage,
                idNumber: idNumber,
                password: password
            });

            savedUser = {
                ...newUser,
                ...response.user,
                avatar: response.user.avatar || "",
                avatarPosition: normalizeAvatarPosition(response.user.avatarPosition)
            };
        } catch (error) {
            savedUser = newUser;
        }
    }

    users.push(savedUser);
    localStorage.setItem("hustleHubUsers", JSON.stringify(users));
    localStorage.setItem("hustleHubCurrentUser", JSON.stringify(savedUser));
    localStorage.setItem("hustleHubJustRegistered", "true");
    localStorage.setItem("hustleHubWelcomeUserEmail", savedUser.email || email);

    form.reset();
    form.classList.remove("was-validated");
    const redirectTarget = getAuthRedirectTarget();
    showRegisterMessage("Account created successfully. Redirecting...", "success");

    window.setTimeout(function () {
        window.location.href = redirectTarget;
    }, 1200);
}

function getAuthRedirectTarget() {
    const redirectTarget = localStorage.getItem("hustleHubAuthRedirect");
    const allowedTargets = ["cart.html", "profile.html", "sell.html", "admin/dashboard.html"];

    if (redirectTarget && allowedTargets.includes(redirectTarget)) {
        localStorage.removeItem("hustleHubAuthRedirect");
        return redirectTarget;
    }

    return "profile.html";
}

function getStoredUsers() {
    const users = localStorage.getItem("hustleHubUsers");

    if (!users) {
        return [];
    }

    try {
        return JSON.parse(users);
    } catch (error) {
        return [];
    }
}

function showRegisterMessage(text, type) {
    showMessage("registerMessage", text, type);
}

function showMessage(elementId, text, type) {
    const message = document.getElementById(elementId);

    if (!message) {
        return;
    }

    message.textContent = text;
    message.className = "alert alert-" + type;
}

function touchCurrentUserActivity(email) {
    const users = getStoredUsers().map(function (user) {
        if (user.email === email) {
            return {
                ...user,
                lastActive: new Date().toISOString()
            };
        }

        return user;
    });
    const currentUser = getCurrentUser();

    localStorage.setItem("hustleHubUsers", JSON.stringify(users));

    if (currentUser && currentUser.email === email) {
        localStorage.setItem("hustleHubCurrentUser", JSON.stringify({
            ...currentUser,
            lastActive: new Date().toISOString()
        }));
    }
}

function setupWelcomeMessage() {
    const welcomeMessage = document.getElementById("welcomeMessage");
    const registrationSuccessMessage = document.getElementById("registrationSuccessMessage");
    const currentUser = getCurrentUser();
    const isFirstRegisterWelcome = localStorage.getItem("hustleHubJustRegistered") === "true";
    const welcomeEmail = localStorage.getItem("hustleHubWelcomeUserEmail");

    if (!isFirstRegisterWelcome || !currentUser || welcomeEmail !== currentUser.email) {
        return;
    }

    if (registrationSuccessMessage) {
        registrationSuccessMessage.textContent = "Successfully registered.";
        registrationSuccessMessage.classList.remove("d-none");
    }

    if (welcomeMessage) {
        welcomeMessage.textContent = "Welcome to HustleHub SA, " + (currentUser.fullName || "new member") + ".";
        welcomeMessage.classList.remove("d-none");
    }

    localStorage.removeItem("hustleHubJustRegistered");
    localStorage.removeItem("hustleHubWelcomeUserEmail");
}

async function handleLogin(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const email = form.email.value.trim().toLowerCase();
    const password = form.password.value;

    form.email.setCustomValidity("");
    validateEmailField(form.email);

    if (!form.checkValidity()) {
        form.classList.add("was-validated");
        showMessage("loginMessage", "Please enter your login details.", "danger");
        return;
    }

    let user = null;

    if (typeof apiRequest === "function") {
        try {
            const response = await apiRequest("login", {
                email: email,
                password: password
            });

            user = response.user;
        } catch (error) {
            user = null;
        }
    }

    if (!user) {
        const users = getStoredUsers();
        user = users.find(function (storedUser) {
            return storedUser.email === email && storedUser.password === password;
        });
    }

    if (!user) {
        showMessage("loginMessage", "Email or password is incorrect.", "danger");
        return;
    }

    localStorage.setItem("hustleHubCurrentUser", JSON.stringify(user));
    touchCurrentUserActivity(user.email);
    const redirectTarget = user.roleId === "admin" ? "admin/dashboard.html" : getAuthRedirectTarget();
    showMessage("loginMessage", "Logged in successfully. Redirecting...", "success");

    window.setTimeout(function () {
        window.location.href = redirectTarget;
    }, 1000);
}

async function handleSellListing(event) {
    event.preventDefault();

    const form = event.currentTarget;

    if (!form.checkValidity()) {
        form.classList.add("was-validated");
        showMessage("sellMessage", "Please complete the required listing details.", "danger");
        return;
    }

    let image = "";

    try {
        image = await getSelectedListingImage(form);
    } catch (error) {
        showMessage("sellMessage", "Please upload a valid image file.", "danger");
        return;
    }

    const listings = getStoredListings();
    const currentUser = getCurrentUser();
    const listing = {
        name: form.itemName.value.trim(),
        price: Number(form.itemPrice.value),
        category: form.itemCategory.value,
        condition: form.itemCondition ? form.itemCondition.value : "Good",
        location: form.itemLocation.value.trim(),
        deliveryOptions: getCheckedValues(form, "deliveryOptions").join(", ") || "Meet seller",
        image: image,
        description: form.itemDescription.value.trim(),
        sellerEmail: getCurrentUserEmail(),
        sellerVerified: Boolean(currentUser && currentUser.verified)
    };

    if (typeof apiRequest === "function") {
        try {
            const response = await apiRequest("listings", {
                sellerId: currentUser ? currentUser.id : null,
                name: listing.name,
                price: listing.price,
                category: listing.category,
                condition: listing.condition,
                location: listing.location,
                deliveryOptions: listing.deliveryOptions,
                image: listing.image,
                description: listing.description
            });

            listing.id = response.id;
        } catch (error) {
            listing.id = Date.now();
        }
    }

    listings.push(listing);
    localStorage.setItem("hustleHubListings", JSON.stringify(listings));
    notifyFollowersOfListing(listing);

    if (form.dataset.editListingId) {
        const editListingId = Number(form.dataset.editListingId);
        const updatedListings = listings.map(function (listingItem) {
            if (Number(listingItem.id) === editListingId) {
                return {
                    ...listingItem,
                    ...listing,
                    id: listingItem.id,
                    sellerEmail: listingItem.sellerEmail,
                    sellerVerified: listingItem.sellerVerified
                };
            }
            return listingItem;
        });

        localStorage.setItem("hustleHubListings", JSON.stringify(updatedListings));
        showMessage("sellMessage", "Listing updated successfully.", "success");
        return;
    }

    if (form.dataset.editListingId) {
        const editListingId = Number(form.dataset.editListingId);
        const existingListing = listings.find(function (listingItem) {
            return Number(listingItem.id) === editListingId;
        });

        if (!existingListing) {
            showMessage("sellMessage", "Unable to find the listing to update.", "danger");
            return;
        }

        if (!isCurrentUserListingOwner(existingListing)) {
            showMessage("sellMessage", "You are not allowed to edit this listing.", "danger");
            return;
        }

        const updatedListings = listings.map(function (listingItem) {
            if (Number(listingItem.id) === editListingId) {
                return {
                    ...listingItem,
                    ...listing,
                    id: listingItem.id,
                    sellerEmail: listingItem.sellerEmail,
                    sellerVerified: listingItem.sellerVerified
                };
            }
            return listingItem;
        });

        localStorage.setItem("hustleHubListings", JSON.stringify(updatedListings));
        showMessage("sellMessage", "Listing updated successfully.", "success");
        return;
    }

    listing.id = Date.now();

    if (typeof apiRequest === "function") {
        try {
            const response = await apiRequest("listings", {
                sellerId: currentUser ? currentUser.id : null,
                name: listing.name,
                price: listing.price,
                category: listing.category,
                condition: listing.condition,
                location: listing.location,
                deliveryOptions: listing.deliveryOptions,
                image: listing.image,
                description: listing.description
            });

            listing.id = response.id;
        } catch (error) {
            listing.id = Date.now();
        }
    }

    listings.push(listing);
    localStorage.setItem("hustleHubListings", JSON.stringify(listings));
    notifyFollowersOfListing(listing);

    form.reset();
    form.classList.remove("was-validated");
    showMessage("sellMessage", "Listing saved successfully.", "success");
}

function getCheckedValues(form, name) {
    return Array.from(form.querySelectorAll("input[name='" + name + "']:checked")).map(function (input) {
        return input.value;
    });
}

function getUploadedImage(primaryInput, fallbackInput) {
    const primaryFile = primaryInput && primaryInput.files ? primaryInput.files[0] : null;
    const fallbackFile = fallbackInput && fallbackInput.files ? fallbackInput.files[0] : null;
    const file = primaryFile || fallbackFile;

    if (!file) {
        return Promise.resolve("");
    }

    if (!file.type.startsWith("image/")) {
        return Promise.reject(new Error("Invalid image type."));
    }

    if (file.size > 2 * 1024 * 1024) {
        return Promise.reject(new Error("Image is too large."));
    }

    return new Promise(function (resolve, reject) {
        const reader = new FileReader();

        reader.onload = function () {
            resolve(reader.result);
        };

        reader.onerror = function () {
            reject(new Error("Could not read image."));
        };

        reader.readAsDataURL(file);
    });
}

function getSelectedListingImage(form) {
    const photoSource = form.photoSource.value;
    const selectedInput = photoSource === "camera" ? form.itemCameraImage : form.itemImage;

    return getUploadedImage(selectedInput);
}

function setupPhotoSourceToggle(form) {
    const uploadGroup = document.getElementById("uploadPhotoGroup");
    const cameraGroup = document.getElementById("cameraPhotoGroup");

    if (!uploadGroup || !cameraGroup) {
        return;
    }

    Array.from(form.photoSource).forEach(function (sourceInput) {
        sourceInput.addEventListener("change", function () {
            const useCamera = form.photoSource.value === "camera";

            uploadGroup.classList.toggle("d-none", useCamera);
            cameraGroup.classList.toggle("d-none", !useCamera);
            form.itemImage.value = "";
            form.itemCameraImage.value = "";
        });
    });
}

function setupSellFormEdit(form) {
    const params = new URLSearchParams(window.location.search);
    const editId = params.get("edit");

    if (!editId) {
        return;
    }

    const listings = getStoredListings();
    const listing = listings.find(function (listingItem) {
        return String(listingItem.id) === String(editId);
    });

    if (!listing) {
        showMessage("sellMessage", "Listing not found.", "danger");
        return;
    }

    if (!isCurrentUserListingOwner(listing)) {
        showMessage("sellMessage", "You are not allowed to edit this listing.", "danger");
        return;
    }

    form.dataset.editListingId = String(listing.id);
    const heading = document.getElementById("sellFormHeading");
    const intro = document.getElementById("sellFormIntro");
    const submitButton = document.getElementById("sellSubmitButton");

    if (heading) {
        heading.textContent = "Edit your listing";
    }

    if (intro) {
        intro.textContent = "Update your item details and save changes.";
    }

    if (submitButton) {
        submitButton.textContent = "Update Listing";
    }

    form.itemName.value = listing.name || "";
    form.itemBrand.value = listing.brand || "";
    form.itemPrice.value = listing.price || "";
    form.itemCategory.value = listing.category || "";
    form.itemCondition.value = listing.condition || "";
    form.itemStatus.value = listing.sold ? "sold" : "available";
    form.itemLocation.value = listing.location || "";
    form.itemDescription.value = listing.description || "";

    Array.from(form.querySelectorAll("input[name='deliveryOptions']")).forEach(function (input) {
        input.checked = listing.deliveryOptions ? listing.deliveryOptions.split(", ").includes(input.value) : false;
    });
}

function setupProfilePhotoSourceToggle(form) {
    const uploadGroup = document.getElementById("profileUploadPhotoGroup");
    const cameraGroup = document.getElementById("profileCameraPhotoGroup");
    const fields = getProfileFormFields(form);

    if (!uploadGroup || !cameraGroup || !fields.profilePhotoSource) {
        return;
    }

    Array.from(fields.profilePhotoSource).forEach(function (sourceInput) {
        sourceInput.addEventListener("change", function () {
            const useCamera = fields.profilePhotoSource.value === "camera";

            uploadGroup.classList.toggle("d-none", useCamera);
            cameraGroup.classList.toggle("d-none", !useCamera);
            fields.profileImage.value = "";
            fields.profileCameraImage.value = "";
        });
    });
}

function setupProfilePhotoPositionControls(form) {
    const preview = document.getElementById("profilePhotoPreview");
    const controls = document.getElementById("profilePhotoPositionControls");
    const fields = getProfileFormFields(form);

    if (!preview || !controls || !fields.profilePhotoX || !fields.profilePhotoY) {
        return;
    }

    const updatePreviewPosition = function () {
        applyAvatarPosition(preview, {
            x: fields.profilePhotoX.value,
            y: fields.profilePhotoY.value
        });
    };
    const showSelectedImage = async function () {
        try {
            const selectedAvatar = await getSelectedProfileImage(form);

            if (selectedAvatar) {
                preview.src = selectedAvatar;
                controls.classList.remove("d-none");
                updatePreviewPosition();
            }
        } catch (error) {
            // The submit handler shows the validation message for invalid files.
        }
    };

    fields.profilePhotoX.addEventListener("input", updatePreviewPosition);
    fields.profilePhotoY.addEventListener("input", updatePreviewPosition);

    if (fields.profileImage) {
        fields.profileImage.addEventListener("change", showSelectedImage);
    }

    if (fields.profileCameraImage) {
        fields.profileCameraImage.addEventListener("change", showSelectedImage);
    }
}

function getSelectedProfileImage(form) {
    const fields = getProfileFormFields(form);

    if (!fields.profilePhotoSource) {
        return Promise.resolve("");
    }

    const selectedInput = fields.profilePhotoSource.value === "camera"
        ? fields.profileCameraImage
        : fields.profileImage;

    return getUploadedImage(selectedInput);
}

function getStoredListings() {
    const listings = localStorage.getItem("hustleHubListings");

    if (!listings) {
        return [];
    }

    try {
        return JSON.parse(listings);
    } catch (error) {
        return [];
    }
}

async function loadSavedListings() {
    const listingsGrid = document.getElementById("listingsGrid");

    if (!listingsGrid) {
        return;
    }

    let listings = getStoredListings();

    if (typeof apiRequest === "function") {
        try {
            const response = await apiRequest("listings");
            listings = response.listings;
            localStorage.setItem("hustleHubListings", JSON.stringify(listings));
        } catch (error) {
            listings = getStoredListings();
        }
    }

    listings.forEach(function (listing) {
        listingsGrid.appendChild(createListingCard(listing, "col-6 col-md-3", false));
    });
}

function loadMyListings() {
    const myListingsGrid = document.getElementById("myListingsGrid");

    if (!myListingsGrid) {
        return;
    }

    const noMyListings = document.getElementById("noMyListings");
    const currentUserEmail = getCurrentUserEmail();

    if (!currentUserEmail) {
        if (noMyListings) {
            noMyListings.classList.remove("d-none");
        }

        return;
    }

    const listings = getStoredListings().filter(function (listing) {
        return !listing.sellerEmail || listing.sellerEmail === currentUserEmail;
    });

    if (noMyListings) {
        noMyListings.classList.toggle("d-none", listings.length > 0);
    }

    listings.forEach(function (listing) {
        myListingsGrid.appendChild(createListingCard(listing, "col-md-6", true));
    });
}

function loadProfileCart() {
    const profileCartItems = document.getElementById("profileCartItems");

    if (!profileCartItems) {
        return;
    }

    const cartTotal = document.getElementById("profileCartTotal");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    let total = 0;

    profileCartItems.innerHTML = "";

    if (cart.length === 0) {
        const emptyCart = document.createElement("p");

        emptyCart.className = "text-muted mb-0";
        emptyCart.textContent = "Your cart is empty.";
        profileCartItems.appendChild(emptyCart);

        if (cartTotal) {
            cartTotal.textContent = "R0";
        }

        return;
    }

    cart.forEach(function (product) {
        const item = document.createElement("div");
        const name = document.createElement("strong");
        const price = document.createElement("span");

        total += Number(product.price) || 0;
        item.className = "list-group-item d-flex justify-content-between align-items-center";
        name.textContent = product.name;
        price.className = "text-success";
        price.textContent = "R" + product.price;
        item.append(name, price);
        profileCartItems.appendChild(item);
    });

    if (cartTotal) {
        cartTotal.textContent = "R" + total;
    }
}

function loadPublicProfileListings() {
    const publicListingsGrid = document.getElementById("publicListingsGrid");

    if (!publicListingsGrid) {
        return;
    }

    const viewedEmail = new URLSearchParams(window.location.search).get("user");
    const currentUser = getCurrentUser();
    const isPublicProfile = viewedEmail && (!currentUser || currentUser.email !== viewedEmail);

    publicListingsGrid.innerHTML = "";

    if (!isPublicProfile) {
        return;
    }

    const listings = BUILT_IN_PRODUCTS.concat(getStoredListings()).filter(function (listing) {
        return listing.sellerEmail === viewedEmail;
    });

    if (listings.length === 0) {
        const empty = document.createElement("p");

        empty.className = "text-muted mb-0";
        empty.textContent = "This user has not listed anything yet.";
        publicListingsGrid.appendChild(empty);
        return;
    }

    listings.forEach(function (listing) {
        publicListingsGrid.appendChild(createListingCard(listing, "col-md-6", false));
    });
}

function loadMarketplaceStats() {
    const usersCount = document.getElementById("marketUsersCount");
    const soldCount = document.getElementById("marketSoldCount");
    const shopsCount = document.getElementById("marketShopsCount");

    if (!usersCount && !soldCount && !shopsCount) {
        return;
    }

    const users = getStoredUsers().filter(function (user) {
        return user.roleId !== "admin";
    });
    const soldBuiltIns = JSON.parse(localStorage.getItem("hustleHubSoldProducts")) || [];
    const soldListings = getStoredListings().filter(function (listing) {
        return listing.sold;
    });
    const shopEmails = new Set(
        getStoredListings()
            .map(function (listing) { return listing.sellerEmail; })
            .filter(Boolean)
            .concat(BUILT_IN_PRODUCTS.map(function (product) { return product.sellerEmail; }))
    );

    if (usersCount) {
        usersCount.textContent = users.length.toLocaleString("en-ZA");
    }

    if (soldCount) {
        soldCount.textContent = (soldBuiltIns.length + soldListings.length).toLocaleString("en-ZA");
    }

    if (shopsCount) {
        shopsCount.textContent = shopEmails.size.toLocaleString("en-ZA");
    }
}

function setupMarketplaceDiscovery() {
    const brandList = document.getElementById("brandDiscoveryList");
    const categoryList = document.getElementById("categoryDiscoveryList");

    if (brandList) {
        renderDiscoveryLinks(brandList, getUniqueValues(BUILT_IN_PRODUCTS, "brand"), "brand");
    }

    if (categoryList) {
        renderDiscoveryLinks(categoryList, getUniqueValues(BUILT_IN_PRODUCTS.concat(getStoredListings()), "category"), "category");
    }
}

function renderDiscoveryLinks(container, values, filterName) {
    container.innerHTML = "";

    values.forEach(function (value) {
        const link = document.createElement("a");

        link.className = "discovery-chip";
        link.href = "listings.html?" + filterName + "=" + encodeURIComponent(value);
        link.textContent = value;
        container.appendChild(link);
    });
}

function getUniqueValues(items, key) {
    return Array.from(new Set(items.map(function (item) {
        return item[key];
    }).filter(Boolean))).sort();
}

function createListingCard(listing, columnClass, showDelete) {
    const image = listing.image || "images/item3.jpg";
    const column = document.createElement("div");
    const card = document.createElement("div");
    const cardImage = document.createElement("img");
    const body = document.createElement("div");
    const title = document.createElement("h5");
    const price = document.createElement("p");
    const location = document.createElement("p");
    const status = document.createElement("p");
    const trust = document.createElement("p");
    const primaryAction = listing.link ? document.createElement("a") : document.createElement("button");
    const meta = document.createElement("p");
    const currentUserEmail = getCurrentUserEmail();

    column.className = columnClass;
    column.dataset.listingId = String(listing.id);
    column.dataset.category = listing.category || "";
    column.dataset.brand = listing.brand || "";
    column.dataset.condition = listing.condition || "";
    column.dataset.price = String(listing.price || 0);
    card.className = "card";
    cardImage.className = "card-img-top";
    cardImage.src = image;
    cardImage.alt = listing.name;
    body.className = "card-body d-flex flex-column";
    title.className = "card-title";
    title.textContent = listing.name;
    price.textContent = "R" + listing.price;
    location.className = "text-muted small";
    location.textContent = listing.location;
    meta.className = "text-muted small";
    meta.textContent = [listing.brand, listing.condition, listing.deliveryOptions].filter(Boolean).join(" | ");
    trust.className = listing.sellerVerified ? "badge text-bg-success align-self-start mb-2" : "badge text-bg-light text-dark align-self-start mb-2";
    trust.textContent = listing.sellerVerified ? "Verified seller" : "Seller not verified";
    status.className = listing.sold ? "badge text-bg-secondary align-self-start mb-2" : "d-none";
    status.textContent = "Sold";
    primaryAction.className = "btn btn-dark w-100 mt-auto";

    if (listing.link) {
        primaryAction.href = listing.link;
        primaryAction.textContent = "View";
    } else {
        primaryAction.type = "button";
        primaryAction.disabled = Boolean(listing.sold);
        primaryAction.textContent = listing.sold ? "Sold" : "Add to Cart";
        primaryAction.addEventListener("click", function () {
            addListingToCart(listing);
        });
    }

    body.append(title, price, location, meta, trust, status, primaryAction);

    if (!showDelete && listing.sellerEmail && listing.sellerEmail !== currentUserEmail) {
        const messageButton = document.createElement("button");

        messageButton.className = "btn btn-outline-dark w-100 mt-2";
        messageButton.type = "button";
        messageButton.dataset.messageUser = listing.sellerEmail;
        messageButton.textContent = "Message Seller";
        body.appendChild(messageButton);
    }

    if (showDelete) {
        if (listing.link) {
            primaryAction.href = listing.link;
            primaryAction.textContent = "View Product";
        } else {
            primaryAction.textContent = "Edit Listing";
            primaryAction.type = "button";
            primaryAction.addEventListener("click", function () {
                window.location.href = "sell.html?edit=" + encodeURIComponent(listing.id);
            });
        }

        const soldButton = document.createElement("button");
        const deleteButton = document.createElement("button");

        soldButton.className = "btn btn-outline-secondary w-100 mt-2 mark-sold-listing";
        soldButton.type = "button";
        soldButton.dataset.listingId = String(listing.id);
        soldButton.textContent = listing.sold ? "Mark Available" : "Mark Sold";
        body.appendChild(soldButton);

        deleteButton.className = "btn btn-outline-danger w-100 mt-2 delete-listing";
        deleteButton.type = "button";
        deleteButton.dataset.listingId = String(listing.id);
        deleteButton.textContent = "Remove";
        body.appendChild(deleteButton);
    }

    card.append(cardImage, body);
    column.appendChild(card);

    return column;
}

function addListingToCart(listing) {
    if (listing.sold) {
        window.alert("This item has already been sold.");
        return;
    }

    if (isCurrentUserListingOwner(listing)) {
        window.alert("You cannot add your own listing to the cart.");
        return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const product = {
        id: listing.id,
        name: listing.name,
        price: Number(listing.price) || 0,
        image: listing.image || "images/item3.jpg",
        sellerEmail: listing.sellerEmail || ""
    };
    const alreadyExists = cart.some(function (item) {
        return normalizeProductName(item.name) === normalizeProductName(product.name);
    });

    if (alreadyExists) {
        window.alert("This product is already in your cart.");
        return;
    }

    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    window.location.href = "cart.html";
}

function setupListingDelete() {
    document.addEventListener("click", function (event) {
        const soldButton = event.target.closest(".mark-sold-listing");
        const deleteButton = event.target.closest(".delete-listing");

        if (soldButton) {
            toggleListingSold(Number(soldButton.dataset.listingId));
            return;
        }

        if (!deleteButton) {
            return;
        }

        const listingId = Number(deleteButton.dataset.listingId);

        if (!window.confirm("Remove this listing?")) {
            return;
        }

        removeListing(listingId);
    });
}

function toggleListingSold(listingId) {
    const listings = getStoredListings().map(function (listing) {
        if (Number(listing.id) === listingId) {
            return {
                ...listing,
                sold: !listing.sold,
                soldAt: listing.sold ? "" : new Date().toISOString()
            };
        }

        return listing;
    });

    localStorage.setItem("hustleHubListings", JSON.stringify(listings));
    window.location.reload();
}

async function removeListing(listingId) {
    if (typeof apiRequest === "function") {
        try {
            await apiRequest("delete-listing", {
                id: listingId
            });
        } catch (error) {
            // Continue with local removal when the API is unavailable.
        }
    }

    const listings = getStoredListings().filter(function (listing) {
        return Number(listing.id) !== listingId;
    });

    localStorage.setItem("hustleHubListings", JSON.stringify(listings));

    document.querySelectorAll('[data-listing-id="' + listingId + '"]').forEach(function (listingCard) {
        listingCard.remove();
    });

    const noMyListings = document.getElementById("noMyListings");

    const myListingsGrid = document.getElementById("myListingsGrid");
    const remainingProfileListings = myListingsGrid ? myListingsGrid.querySelectorAll("[data-listing-id]").length : listings.length;

    if (noMyListings && remainingProfileListings === 0) {
        noMyListings.classList.remove("d-none");
    }
}

function getCurrentUserEmail() {
    const currentUser = getCurrentUser();

    return currentUser ? currentUser.email || "" : "";
}

function getCurrentUser() {
    const currentUser = localStorage.getItem("hustleHubCurrentUser");

    if (!currentUser) {
        return null;
    }

    try {
        return JSON.parse(currentUser);
    } catch (error) {
        return null;
    }
}

function updateNavbarForLoginState() {
    const currentUser = getCurrentUser();
    const linksToHide = currentUser
        ? '.navbar a[href="login.html"], .navbar a[href="register.html"]'
        : '.navbar a[href="profile.html"]';

    document.querySelectorAll(linksToHide).forEach(function (link) {
        const navItem = link.closest(".nav-item");

        if (navItem) {
            navItem.remove();
        } else {
            link.remove();
        }
    });

    document.querySelectorAll(".navbar-nav").forEach(function (navList) {
        const prefix = window.location.pathname.includes("/admin/") ? "../" : "";

        addNavLink(navList, prefix + "users.html", "Users");

        if (currentUser) {
            addNavLink(navList, prefix + "messages.html", "Messages", {
                iconClass: "message-icon"
            });
            addNavLink(navList, prefix + "notifications.html", "Notifications", {
                badgeCount: getUnreadNotificationCount(currentUser.email)
            });
            decorateNavLink(navList, "messages.html", {
                iconClass: "message-icon"
            });
            decorateNavLink(navList, "notifications.html", {
                badgeCount: getUnreadNotificationCount(currentUser.email)
            });
        }

        if (currentUser && currentUser.roleId === "admin" && !window.location.pathname.includes("/admin/")) {
            addNavLink(navList, "admin/dashboard.html", "Admin");
        }
    });
}

function addNavLink(navList, href, label, options) {
    const settings = options || {};
    const exists = Array.from(navList.querySelectorAll("a")).some(function (link) {
        return link.getAttribute("href") === href || link.textContent.trim() === label;
    });

    if (exists) {
        return;
    }

    const item = document.createElement("li");
    const link = document.createElement("a");

    item.className = "nav-item";
    link.className = "nav-link";
    link.href = href;

    if (settings.iconClass) {
        const icon = document.createElement("span");

        icon.className = settings.iconClass;
        icon.setAttribute("aria-hidden", "true");
        link.classList.add("icon-button");
        link.appendChild(icon);
    }

    link.appendChild(document.createTextNode(label));

    if (settings.badgeCount) {
        const badge = document.createElement("span");

        badge.className = "notification-badge ms-1";
        badge.textContent = String(settings.badgeCount);
        link.appendChild(badge);
    }

    item.appendChild(link);
    navList.appendChild(item);
}

function decorateNavLink(navList, hrefSuffix, options) {
    const settings = options || {};
    const link = Array.from(navList.querySelectorAll("a")).find(function (item) {
        const href = item.getAttribute("href") || "";

        return href === hrefSuffix || href.endsWith("/" + hrefSuffix) || href.endsWith(hrefSuffix);
    });

    if (!link) {
        return;
    }

    if (settings.iconClass && !link.querySelector("." + settings.iconClass)) {
        const icon = document.createElement("span");

        icon.className = settings.iconClass;
        icon.setAttribute("aria-hidden", "true");
        link.classList.add("icon-button");
        link.prepend(icon);
    }

    link.querySelectorAll(".notification-badge").forEach(function (badge) {
        badge.remove();
    });

    if (settings.badgeCount) {
        const badge = document.createElement("span");

        badge.className = "notification-badge ms-1";
        badge.textContent = String(settings.badgeCount);
        link.appendChild(badge);
    }
}

function setupProductSearch() {
    const searchInput = document.querySelector(".product-search");
    const productGrid = document.querySelector(".product-grid");
    const filterForm = document.getElementById("listingFilterForm");

    if (!searchInput || !productGrid) {
        return;
    }

    const noResults = document.createElement("p");
    noResults.className = "text-center text-muted d-none w-100";
    noResults.textContent = "No products found.";
    productGrid.appendChild(noResults);

    searchInput.addEventListener("input", function () {
        if (filterForm) {
            filterProductGrid(productGrid, filterForm);
            return;
        }

        filterProductGrid(productGrid, null);
        noResults.classList.add("d-none");
    });
}

function setupMarketplaceFilters() {
    const productGrid = document.querySelector(".product-grid");
    const filterForm = document.getElementById("listingFilterForm");

    if (!productGrid || !filterForm) {
        hydrateStaticProductCards(productGrid);
        return;
    }

    hydrateStaticProductCards(productGrid);
    populateFilterOptions(filterForm);
    applyQueryFilters(filterForm);

    filterForm.addEventListener("input", function () {
        filterProductGrid(productGrid, filterForm);
    });

    filterForm.addEventListener("reset", function () {
        window.setTimeout(function () {
            filterProductGrid(productGrid, filterForm);
        }, 0);
    });

    filterProductGrid(productGrid, filterForm);
}

function hydrateStaticProductCards(productGrid) {
    Array.from(productGrid.querySelectorAll(".col-6")).forEach(function (column) {
        const title = column.querySelector(".card-title");
        const priceText = Array.from(column.querySelectorAll("p")).find(function (paragraph) {
            return parsePriceValue(paragraph.textContent) > 0;
        });

        if (!title) {
            return;
        }

        const product = BUILT_IN_PRODUCTS.find(function (item) {
            return normalizeProductName(item.name) === normalizeProductName(title.textContent);
        });

        if (product) {
            column.dataset.category = product.category;
            column.dataset.brand = product.brand;
            column.dataset.condition = product.condition;
        }

        if (!column.dataset.price && priceText) {
            column.dataset.price = String(parsePriceValue(priceText.textContent));
        } else if (product) {
            column.dataset.price = String(product.price);
        }
    });
}

function populateFilterOptions(form) {
    fillSelectOptions(form.category, getUniqueValues(BUILT_IN_PRODUCTS.concat(getStoredListings()), "category"));
    fillSelectOptions(form.brand, getUniqueValues(BUILT_IN_PRODUCTS.concat(getStoredListings()), "brand"));
    fillSelectOptions(form.condition, getUniqueValues(BUILT_IN_PRODUCTS.concat(getStoredListings()), "condition"));
}

function fillSelectOptions(select, values) {
    if (!select || select.options.length > 1) {
        return;
    }

    values.forEach(function (value) {
        const option = document.createElement("option");

        option.value = value;
        option.textContent = value;
        select.appendChild(option);
    });
}

function applyQueryFilters(form) {
    const params = new URLSearchParams(window.location.search);

    ["category", "brand", "condition"].forEach(function (name) {
        if (form[name] && params.get(name)) {
            form[name].value = params.get(name);
        }
    });
}

function filterProductGrid(productGrid, form) {
    const searchInput = document.querySelector(".product-search");
    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    const maxPrice = form && form.maxPrice ? parsePriceValue(form.maxPrice.value) || Infinity : Infinity;
    const category = form && form.category ? form.category.value : "";
    const brand = form && form.brand ? form.brand.value : "";
    const condition = form && form.condition ? form.condition.value : "";
    const productCards = Array.from(productGrid.querySelectorAll(".col-6"));
    let visibleCount = 0;

    productCards.forEach(function (column) {
        const price = parsePriceValue(column.dataset.price || column.textContent);
        const productText = column.textContent.toLowerCase();
        const isMatch = (!category || column.dataset.category === category)
            && (!brand || column.dataset.brand === brand)
            && (!condition || column.dataset.condition === condition)
            && price <= maxPrice
            && (!query || productText.includes(query));

        column.classList.toggle("d-none", !isMatch);

        if (isMatch) {
            visibleCount += 1;
        }
    });

    const noResults = productGrid.querySelector(".filter-no-results") || document.createElement("p");

    noResults.className = "filter-no-results text-center text-muted w-100" + (visibleCount > 0 ? " d-none" : "");
    noResults.textContent = query ? "No products found." : "No items match these filters.";

    if (!noResults.parentElement) {
        productGrid.appendChild(noResults);
    }
}

function parsePriceValue(value) {
    const text = String(value || "");
    const priceMatch = text.match(/r\s*([0-9][0-9\s,.]*)/i);
    let normalizedValue = (priceMatch ? priceMatch[1] : text).replace(/[^0-9,.]/g, "");

    if (normalizedValue.includes(",") && normalizedValue.includes(".")) {
        normalizedValue = normalizedValue.replace(/,/g, "");
    } else if (/\d,\d{1,2}$/.test(normalizedValue)) {
        normalizedValue = normalizedValue.replace(",", ".");
    } else {
        normalizedValue = normalizedValue.replace(/,/g, "");
    }

    const price = Number(normalizedValue);

    return Number.isFinite(price) ? price : 0;
}

function setupUserSearch() {
    const userGrid = document.getElementById("userSearchResults");
    const searchInput = document.getElementById("userSearchInput");

    if (!userGrid || !searchInput) {
        return;
    }

    const render = function () {
        const query = searchInput.value.trim().toLowerCase();
        const currentUser = getCurrentUser();
        const canSeeAdmins = currentUser && currentUser.roleId === "admin";
        const users = getStoredUsers().filter(function (user) {
            const text = [user.fullName, user.email, user.location, user.roleId].join(" ").toLowerCase();

            return (canSeeAdmins || user.roleId !== "admin") && text.includes(query);
        });

        userGrid.innerHTML = "";

        if (users.length === 0) {
            userGrid.innerHTML = '<p class="text-muted mb-0">No user profiles found.</p>';
            return;
        }

        users.forEach(function (user) {
            userGrid.appendChild(createUserProfileCard(user));
        });
    };

    searchInput.addEventListener("input", render);
    render();
}

function createUserProfileCard(user) {
    const column = document.createElement("div");
    const card = document.createElement("a");
    const safeName = escapeHtml(user.fullName || "HustleHub User");
    const safeLocation = escapeHtml(user.location || "South Africa");
    const safeBio = escapeHtml(user.bio || "HustleHub member");

    column.className = "col-md-6 col-lg-4";
    card.className = "profile-result card h-100 text-decoration-none text-dark";
    card.href = "profile.html?user=" + encodeURIComponent(user.email);
    card.innerHTML = `
        <div class="card-body d-flex align-items-center gap-3">
            ${getAvatarMarkup(user, "profile-thumb")}
            <div>
                <h2 class="h6 mb-1">${safeName}</h2>
                <p class="text-muted small mb-1">${safeLocation}</p>
                <p class="small mb-0">${safeBio}</p>
            </div>
        </div>
    `;

    column.appendChild(card);
    return column;
}

function getAvatarMarkup(user, className) {
    const name = user.fullName || user.email || "User";
    const initials = getInitials(name);
    const position = getAvatarObjectPosition(user);
    const safeClassName = escapeAttribute(className);
    const safeName = escapeAttribute(name);

    if (user.avatar) {
        return `<img src="${escapeAttribute(user.avatar)}" class="${safeClassName}" alt="${safeName} profile picture" style="object-position: ${escapeAttribute(position)};">`;
    }

    return `<span class="${safeClassName} avatar-placeholder" aria-label="${safeName} profile picture">${escapeHtml(initials)}</span>`;
}

function escapeHtml(value) {
    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function escapeAttribute(value) {
    return escapeHtml(value).replace(/`/g, "&#096;");
}

function normalizeAvatarPosition(position) {
    const x = position && Number.isFinite(Number(position.x)) ? Number(position.x) : 50;
    const y = position && Number.isFinite(Number(position.y)) ? Number(position.y) : 50;

    return {
        x: Math.min(100, Math.max(0, x)),
        y: Math.min(100, Math.max(0, y))
    };
}

function getAvatarObjectPosition(user) {
    const position = normalizeAvatarPosition(user ? user.avatarPosition : null);

    return position.x + "% " + position.y + "%";
}

function applyAvatarPosition(element, position) {
    if (!element) {
        return;
    }

    const avatarPosition = normalizeAvatarPosition(position);
    const offsetX = (50 - avatarPosition.x) * 0.18;
    const offsetY = (50 - avatarPosition.y) * 0.18;

    element.style.objectPosition = avatarPosition.x + "% " + avatarPosition.y + "%";
    element.style.setProperty("--avatar-x", avatarPosition.x);
    element.style.setProperty("--avatar-y", avatarPosition.y);
    element.style.setProperty("--avatar-offset-x", offsetX + "%");
    element.style.setProperty("--avatar-offset-y", offsetY + "%");
}

function getInitials(name) {
    return String(name || "U")
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(function (part) {
            return part.charAt(0).toUpperCase();
        })
        .join("") || "U";
}

function loadProfileDetails() {
    const profileName = document.getElementById("profileName");

    if (!profileName) {
        return;
    }

    const viewedEmail = new URLSearchParams(window.location.search).get("user");
    const currentUser = getCurrentUser();
    const user = viewedEmail
        ? getStoredUsers().find(function (storedUser) {
            return storedUser.email === viewedEmail;
        })
        : currentUser;
    const profileContent = document.getElementById("profileContent");
    const profileLoginPrompt = document.getElementById("profileLoginPrompt");

    if (!user) {
        if (profileContent) {
            profileContent.classList.add("d-none");
        }

        if (profileLoginPrompt) {
            profileLoginPrompt.classList.remove("d-none");
        }

        return;
    }

    if (profileContent) {
        profileContent.classList.remove("d-none");
    }

    if (profileLoginPrompt) {
        profileLoginPrompt.classList.add("d-none");
    }

    const profileLocation = document.getElementById("profileLocation");
    const profileEmail = document.getElementById("profileEmail");
    const profilePhone = document.getElementById("profilePhone");
    const profileVerifiedStatus = document.getElementById("profileVerifiedStatus");
    const profileSellerType = document.getElementById("profileSellerType");
    const profileLanguage = document.getElementById("profileLanguage");
    const profileMemberSince = document.getElementById("profileMemberSince");
    const profileBio = document.getElementById("profileBio");
    const profileAvatar = document.getElementById("profileAvatar");
    const profileAvatarButton = document.getElementById("profileAvatarButton");
    const profileAvatarPlaceholder = document.getElementById("profileAvatarPlaceholder");
    const publicProfileActions = document.getElementById("publicProfileActions");
    const privateProfileActions = document.getElementById("privateProfileActions");
    const privateProfileSections = document.getElementById("privateProfileSections");
    const publicProfileSections = document.getElementById("publicProfileSections");
    const isPublicProfile = viewedEmail && (!currentUser || currentUser.email !== viewedEmail);

    profileName.textContent = user.fullName || "HustleHub User";

    if (profileLocation) {
        profileLocation.textContent = user.location || "South Africa";
    }

    if (profileEmail) {
        profileEmail.textContent = user.email || "Not set";
    }

    if (profilePhone) {
        profilePhone.textContent = user.phone || "Not set";
    }

    if (profileVerifiedStatus) {
        profileVerifiedStatus.textContent = user.verified ? "Verified seller" : "Unverified";
        profileVerifiedStatus.className = user.verified ? "badge text-bg-success" : "badge text-bg-secondary";
    }

    if (profileSellerType) {
        profileSellerType.textContent = user.sellerType || (user.roleId === "seller" ? "Student reseller" : "Buyer");
    }

    if (profileLanguage) {
        profileLanguage.textContent = user.preferredLanguage || "English";
    }

    if (profileMemberSince) {
        profileMemberSince.textContent = user.memberSince || "January 2026";
    }

    if (profileBio) {
        profileBio.textContent = user.bio || "No bio added yet.";
    }

    if (profileAvatar) {
        profileAvatar.classList.toggle("d-none", !user.avatar);

        if (user.avatar) {
            profileAvatar.src = user.avatar;
            profileAvatar.alt = (user.fullName || "HustleHub user") + " profile picture";
            applyAvatarPosition(profileAvatar, user.avatarPosition);
        } else {
            profileAvatar.removeAttribute("src");
            profileAvatar.style.objectPosition = "";
            profileAvatar.style.removeProperty("--avatar-x");
            profileAvatar.style.removeProperty("--avatar-y");
            profileAvatar.style.removeProperty("--avatar-offset-x");
            profileAvatar.style.removeProperty("--avatar-offset-y");
        }
    }

    if (profileAvatarPlaceholder) {
        profileAvatarPlaceholder.textContent = isPublicProfile ? getInitials(user.fullName || user.email) : "Add Photo";
        profileAvatarPlaceholder.classList.toggle("d-none", Boolean(user.avatar));
    }

    if (profileAvatarButton) {
        profileAvatarButton.disabled = isPublicProfile;
        profileAvatarButton.classList.toggle("profile-photo-public", isPublicProfile);
    }

    if (publicProfileActions) {
        publicProfileActions.classList.toggle("d-none", !isPublicProfile);
        publicProfileActions.querySelectorAll("[data-message-user]").forEach(function (button) {
            button.dataset.messageUser = user.email;
        });
        publicProfileActions.querySelectorAll("[data-follow-user]").forEach(function (button) {
            button.dataset.followUser = user.email;
            updateFollowButton(button, user.email);
        });
    }

    if (privateProfileActions) {
        privateProfileActions.classList.toggle("d-none", isPublicProfile);
    }

    if (privateProfileSections) {
        privateProfileSections.classList.toggle("d-none", isPublicProfile);
    }

    if (publicProfileSections) {
        publicProfileSections.classList.toggle("d-none", !isPublicProfile);
    }
}

function setupProfileActions() {
    const profileForm = document.getElementById("profileForm");
    const editButton = document.getElementById("editProfileButton");
    const avatarButton = document.getElementById("profileAvatarButton");
    const cancelButton = document.getElementById("cancelEditProfileButton");
    const deleteButton = document.getElementById("deleteAccountButton");
    const editSection = document.getElementById("editProfileSection");

    if (editButton && editSection) {
        editButton.addEventListener("click", function () {
            populateProfileForm();
            editSection.classList.remove("d-none");
            editSection.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    }

    if (avatarButton && editSection) {
        avatarButton.addEventListener("click", function () {
            const currentUser = getCurrentUser();
            const viewedEmail = new URLSearchParams(window.location.search).get("user");

            if (!currentUser || (viewedEmail && viewedEmail !== currentUser.email)) {
                return;
            }

            populateProfileForm();
            editSection.classList.remove("d-none");
            editSection.scrollIntoView({ behavior: "smooth", block: "start" });

            window.setTimeout(function () {
                const profileImageInput = document.getElementById("profileImage");

                if (profileImageInput) {
                    profileImageInput.click();
                }
            }, 200);
        });
    }

    if (cancelButton && editSection) {
        cancelButton.addEventListener("click", function () {
            editSection.classList.add("d-none");
        });
    }

    if (profileForm) {
        profileForm.addEventListener("submit", handleProfileUpdate);
        setupProfilePhotoSourceToggle(profileForm);
        setupProfilePhotoPositionControls(profileForm);
    }

    if (deleteButton) {
        deleteButton.addEventListener("click", handleAccountDelete);
    }
}

function populateProfileForm() {
    const form = document.getElementById("profileForm");
    const user = getCurrentUser();

    if (!form || !user) {
        return;
    }

    const fields = getProfileFormFields(form);

    fields.fullName.value = user.fullName || "";
    fields.email.value = user.email || "";
    fields.phone.value = user.phone || "";
    fields.location.value = user.location || "";
    if (fields.sellerType) {
        fields.sellerType.value = user.sellerType || (user.roleId === "seller" ? "Student reseller" : "Buyer");
    }
    if (fields.preferredLanguage) {
        fields.preferredLanguage.value = user.preferredLanguage || "English";
    }
    if (fields.idNumber) {
        fields.idNumber.value = user.idNumber || "";
    }
    if (fields.bio) {
        fields.bio.value = user.bio || "";
    }
    if (fields.profileImage) {
        fields.profileImage.value = "";
    }
    if (fields.profileCameraImage) {
        fields.profileCameraImage.value = "";
    }
    if (fields.profilePhotoSource) {
        fields.profilePhotoSource.value = "upload";
    }
    if (fields.profilePhotoX && fields.profilePhotoY) {
        const avatarPosition = normalizeAvatarPosition(user.avatarPosition);

        fields.profilePhotoX.value = avatarPosition.x;
        fields.profilePhotoY.value = avatarPosition.y;
    }
    const uploadGroup = document.getElementById("profileUploadPhotoGroup");
    const cameraGroup = document.getElementById("profileCameraPhotoGroup");
    const positionControls = document.getElementById("profilePhotoPositionControls");
    const preview = document.getElementById("profilePhotoPreview");

    if (uploadGroup && cameraGroup) {
        uploadGroup.classList.remove("d-none");
        cameraGroup.classList.add("d-none");
    }

    if (positionControls && preview) {
        positionControls.classList.toggle("d-none", !user.avatar);

        if (user.avatar) {
            preview.src = user.avatar;
            applyAvatarPosition(preview, user.avatarPosition);
        } else {
            preview.removeAttribute("src");
            preview.style.objectPosition = "";
            preview.style.removeProperty("--avatar-x");
            preview.style.removeProperty("--avatar-y");
            preview.style.removeProperty("--avatar-offset-x");
            preview.style.removeProperty("--avatar-offset-y");
        }
    }
    fields.email.setCustomValidity("");
    form.classList.remove("was-validated");
}

function getProfileFormFields(form) {
    return {
        fullName: form.elements.fullName,
        email: form.elements.email,
        phone: form.elements.phone,
        location: form.elements.location,
        sellerType: form.elements.sellerType,
        preferredLanguage: form.elements.preferredLanguage,
        idNumber: form.elements.idNumber,
        bio: form.elements.bio,
        profilePhotoSource: form.elements.profilePhotoSource,
        profileImage: form.elements.profileImage,
        profileCameraImage: form.elements.profileCameraImage,
        profilePhotoX: form.elements.profilePhotoX,
        profilePhotoY: form.elements.profilePhotoY
    };
}

async function handleProfileUpdate(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const fields = getProfileFormFields(form);
    const currentUser = getCurrentUser();

    if (!currentUser) {
        showMessage("profileMessage", "Please log in before editing your profile.", "danger");
        return;
    }

    const newEmail = fields.email.value.trim().toLowerCase();
    const oldEmail = currentUser.email;

    fields.email.setCustomValidity("");
    fields.phone.setCustomValidity("");
    validateEmailField(fields.email);
    validatePhoneField(fields.phone);

    const emailTaken = getStoredUsers().some(function (user) {
        return user.email === newEmail && user.email !== oldEmail;
    });

    if (emailTaken) {
        fields.email.setCustomValidity("This email is already registered.");
    }

    if (!form.checkValidity()) {
        form.classList.add("was-validated");
        showMessage("profileMessage", "Please fix the highlighted fields.", "danger");
        return;
    }

    let avatar = currentUser.avatar || "";
    const avatarPosition = normalizeAvatarPosition({
        x: fields.profilePhotoX ? fields.profilePhotoX.value : 50,
        y: fields.profilePhotoY ? fields.profilePhotoY.value : 50
    });

    try {
        const selectedAvatar = await getSelectedProfileImage(form);

        if (selectedAvatar) {
            avatar = selectedAvatar;
        }
    } catch (error) {
        showMessage("profileMessage", "Please upload a valid profile image under 2MB.", "danger");
        return;
    }

    const updatedUser = {
        ...currentUser,
        fullName: fields.fullName.value.trim(),
        email: newEmail,
        phone: fields.phone.value.trim(),
        location: fields.location.value,
        sellerType: fields.sellerType ? fields.sellerType.value : currentUser.sellerType || "Buyer",
        preferredLanguage: fields.preferredLanguage ? fields.preferredLanguage.value : currentUser.preferredLanguage || "English",
        idNumber: fields.idNumber ? fields.idNumber.value.trim() : currentUser.idNumber || "",
        verified: fields.idNumber ? fields.idNumber.value.trim().length >= 6 : Boolean(currentUser.verified),
        bio: fields.bio ? fields.bio.value.trim() : currentUser.bio || "",
        avatar: avatar,
        avatarPosition: avatarPosition
    };

    if (typeof apiRequest === "function") {
        try {
            const response = await apiRequest("update-profile", {
                id: updatedUser.id,
                fullName: updatedUser.fullName,
                email: updatedUser.email,
                phone: updatedUser.phone,
                location: updatedUser.location,
                sellerType: updatedUser.sellerType,
                preferredLanguage: updatedUser.preferredLanguage,
                idNumber: updatedUser.idNumber
            });

            Object.assign(updatedUser, response.user);
            updatedUser.avatar = avatar;
            updatedUser.avatarPosition = avatarPosition;
        } catch (error) {
            // Keep local prototype behavior when the API is unavailable.
        }
    }

    const users = getStoredUsers().map(function (user) {
        if (user.email === oldEmail) {
            return updatedUser;
        }

        return user;
    });

    const listings = getStoredListings().map(function (listing) {
        if (listing.sellerEmail === oldEmail) {
            return {
                ...listing,
                sellerEmail: newEmail
            };
        }

        return listing;
    });

    localStorage.setItem("hustleHubUsers", JSON.stringify(users));
    localStorage.setItem("hustleHubCurrentUser", JSON.stringify(updatedUser));
    localStorage.setItem("hustleHubListings", JSON.stringify(listings));

    loadProfileDetails();
    document.getElementById("editProfileSection").classList.add("d-none");
    showMessage("profileMessage", "Profile updated successfully.", "success");
}

async function handleAccountDelete() {
    const currentUser = getCurrentUser();

    if (!currentUser) {
        showMessage("profileMessage", "No account is currently logged in.", "warning");
        return;
    }

    if (!window.confirm("Delete your account and all your listings? This cannot be undone.")) {
        return;
    }

    const email = currentUser.email;

    if (typeof apiRequest === "function" && currentUser.id) {
        try {
            await apiRequest("delete-account", {
                id: currentUser.id
            });
        } catch (error) {
            // Continue with local cleanup if the API is unavailable.
        }
    }

    const users = getStoredUsers().filter(function (user) {
        return user.email !== email;
    });
    const listings = getStoredListings().filter(function (listing) {
        return listing.sellerEmail && listing.sellerEmail !== email;
    });

    localStorage.setItem("hustleHubUsers", JSON.stringify(users));
    localStorage.setItem("hustleHubListings", JSON.stringify(listings));
    localStorage.removeItem("hustleHubCurrentUser");

    showMessage("profileMessage", "Account deleted. Redirecting...", "success");

    window.setTimeout(function () {
        window.location.href = "index.html";
    }, 1000);
}

function setupPublicProfile() {
    document.addEventListener("click", function (event) {
        const followButton = event.target.closest("[data-follow-user]");
        const messageButton = event.target.closest("[data-message-user]");

        if (followButton) {
            handleFollowButtonClick(followButton);
            return;
        }

        if (!messageButton) {
            return;
        }

        const currentUser = getCurrentUser();

        if (!currentUser) {
            window.location.href = "login.html";
            return;
        }

        window.location.href = "messages.html?user=" + encodeURIComponent(messageButton.dataset.messageUser);
    });
}

function getFollows() {
    try {
        return JSON.parse(localStorage.getItem("hustleHubFollows")) || [];
    } catch (error) {
        return [];
    }
}

function saveFollows(follows) {
    localStorage.setItem("hustleHubFollows", JSON.stringify(follows));
}

function isFollowingUser(followerEmail, followedEmail) {
    return getFollows().some(function (follow) {
        return follow.followerEmail === followerEmail && follow.followedEmail === followedEmail;
    });
}

function handleFollowButtonClick(button) {
    const currentUser = getCurrentUser();
    const followedEmail = button.dataset.followUser;

    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }

    if (!followedEmail || followedEmail === currentUser.email) {
        return;
    }

    const followedUser = getStoredUsers().find(function (user) {
        return user.email === followedEmail;
    });
    const follows = getFollows();
    const existing = follows.some(function (follow) {
        return follow.followerEmail === currentUser.email && follow.followedEmail === followedEmail;
    });
    const updatedFollows = existing
        ? follows.filter(function (follow) {
            return !(follow.followerEmail === currentUser.email && follow.followedEmail === followedEmail);
        })
        : follows.concat({
            followerEmail: currentUser.email,
            followedEmail: followedEmail,
            followedName: followedUser ? followedUser.fullName : followedEmail,
            followedAt: new Date().toISOString()
        });

    saveFollows(updatedFollows);
    updateFollowButton(button, followedEmail);
    loadFollowingList();
    showMessage(
        "profileMessage",
        existing ? "You are no longer following this user." : "You will be notified when this user posts new items.",
        existing ? "secondary" : "success"
    );
}

function updateFollowButton(button, followedEmail) {
    const currentUser = getCurrentUser();
    const isFollowing = currentUser && isFollowingUser(currentUser.email, followedEmail);

    button.textContent = isFollowing ? "Following" : "Follow User";
    button.classList.toggle("btn-dark", !isFollowing);
    button.classList.toggle("btn-outline-dark", Boolean(isFollowing));
}

function loadFollowingList() {
    const followingList = document.getElementById("followingList");

    if (!followingList) {
        return;
    }

    const currentUser = getCurrentUser();
    const follows = getFollows().filter(function (follow) {
        return currentUser && follow.followerEmail === currentUser.email;
    });

    followingList.innerHTML = "";

    if (follows.length === 0) {
        const empty = document.createElement("p");

        empty.className = "text-muted mb-0";
        empty.textContent = "You are not following anyone yet.";
        followingList.appendChild(empty);
        return;
    }

    follows.forEach(function (follow) {
        const user = getStoredUsers().find(function (storedUser) {
            return storedUser.email === follow.followedEmail;
        }) || { fullName: follow.followedName || follow.followedEmail, email: follow.followedEmail };
        const link = document.createElement("a");

        link.className = "list-group-item list-group-item-action d-flex align-items-center gap-3";
        link.href = "profile.html?user=" + encodeURIComponent(follow.followedEmail);
        link.innerHTML = `
            ${getAvatarMarkup(user, "profile-thumb")}
            <span class="text-start">
                <strong>${escapeHtml(user.fullName || follow.followedEmail)}</strong><br>
                <span class="small text-muted">${escapeHtml(user.email || follow.followedEmail)}</span>
            </span>
        `;
        followingList.appendChild(link);
    });
}

function getNotifications() {
    try {
        return JSON.parse(localStorage.getItem("hustleHubNotifications")) || [];
    } catch (error) {
        return [];
    }
}

function saveNotifications(notifications) {
    localStorage.setItem("hustleHubNotifications", JSON.stringify(notifications));
}

function getUnreadNotificationCount(userEmail) {
    return getNotifications().filter(function (notification) {
        return notification.userEmail === userEmail && !notification.read;
    }).length;
}

function notifyFollowersOfListing(listing) {
    const sellerEmail = listing.sellerEmail;

    if (!sellerEmail) {
        return;
    }

    const seller = getStoredUsers().find(function (user) {
        return user.email === sellerEmail;
    }) || { fullName: sellerEmail };
    const followers = getFollows().filter(function (follow) {
        return follow.followedEmail === sellerEmail && follow.followerEmail !== sellerEmail;
    });

    if (followers.length === 0) {
        return;
    }

    const existingNotifications = getNotifications();
    const createdAt = new Date().toISOString();
    const newNotifications = followers.map(function (follow) {
        return {
            id: Date.now() + "-" + Math.random().toString(36).slice(2),
            userEmail: follow.followerEmail,
            actorEmail: sellerEmail,
            actorName: seller.fullName || sellerEmail,
            listingId: listing.id,
            listingName: listing.name,
            message: (seller.fullName || sellerEmail) + " posted " + listing.name + ".",
            link: "profile.html?user=" + encodeURIComponent(sellerEmail),
            read: false,
            createdAt: createdAt
        };
    });

    saveNotifications(newNotifications.concat(existingNotifications));
}

function setupNotificationsPage() {
    const notificationList = document.getElementById("notificationList");
    const markReadButton = document.getElementById("markNotificationsRead");
    const loginPrompt = document.getElementById("notificationLoginPrompt");

    if (!notificationList) {
        return;
    }

    const currentUser = getCurrentUser();

    if (!currentUser) {
        if (loginPrompt) {
            loginPrompt.classList.remove("d-none");
        }

        if (markReadButton) {
            markReadButton.classList.add("d-none");
        }

        notificationList.innerHTML = "";
        return;
    }

    renderNotifications(currentUser.email);

    if (markReadButton) {
        markReadButton.addEventListener("click", function () {
            const notifications = getNotifications().map(function (notification) {
                if (notification.userEmail === currentUser.email) {
                    return {
                        ...notification,
                        read: true
                    };
                }

                return notification;
            });

            saveNotifications(notifications);
            renderNotifications(currentUser.email);
            updateNavbarForLoginState();
        });
    }
}

function renderNotifications(userEmail) {
    const notificationList = document.getElementById("notificationList");
    const notifications = getNotifications()
        .filter(function (notification) {
            return notification.userEmail === userEmail;
        })
        .sort(function (a, b) {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

    notificationList.innerHTML = "";

    if (notifications.length === 0) {
        const empty = document.createElement("p");

        empty.className = "text-muted mb-0";
        empty.textContent = "No notifications yet.";
        notificationList.appendChild(empty);
        return;
    }

    notifications.forEach(function (notification) {
        const item = document.createElement("a");
        const actor = getStoredUsers().find(function (user) {
            return user.email === notification.actorEmail;
        }) || { fullName: notification.actorName || notification.actorEmail, email: notification.actorEmail };

        item.className = "list-group-item list-group-item-action notification-item" + (notification.read ? "" : " unread");
        item.href = notification.link || "listings.html";
        item.dataset.notificationId = notification.id;
        item.innerHTML = `
            <div class="d-flex align-items-center gap-3">
                ${getAvatarMarkup(actor, "profile-thumb")}
                <div class="flex-grow-1">
                    <div class="d-flex justify-content-between gap-3">
                        <strong>${escapeHtml(notification.message)}</strong>
                        <span class="small text-muted">${escapeHtml(formatRelativeTime(notification.createdAt))}</span>
                    </div>
                    <span class="small text-muted">View new listings from ${escapeHtml(notification.actorName || notification.actorEmail)}</span>
                </div>
            </div>
        `;
        item.addEventListener("click", function () {
            markNotificationRead(notification.id);
        });
        notificationList.appendChild(item);
    });
}

function markNotificationRead(notificationId) {
    const notifications = getNotifications().map(function (notification) {
        if (notification.id === notificationId) {
            return {
                ...notification,
                read: true
            };
        }

        return notification;
    });

    saveNotifications(notifications);
}

function setupProductActions() {
    const cartButton = document.getElementById("cart-button");
    const product = getCurrentProductFromPage();

    if (!cartButton || !product) {
        return;
    }

    product.sold = isProductSold(product);

    if (isCurrentUserAdmin()) {
        cartButton.classList.add("d-none");
    }

    if (product.sold) {
        cartButton.disabled = true;
        cartButton.textContent = "Sold";
        cartButton.classList.remove("btn-dark");
        cartButton.classList.add("btn-secondary");
        cartButton.classList.remove("d-none");
    } else if (isCurrentUserListingOwner(product)) {
        cartButton.disabled = true;
        cartButton.textContent = "Your Listing";
        cartButton.classList.remove("btn-dark");
        cartButton.classList.add("btn-secondary");
    }

    const actions = document.createElement("div");
    actions.className = "product-actions mt-3";
    actions.innerHTML = `
        <div class="d-flex gap-2 flex-wrap">
            <button class="btn btn-outline-danger flex-fill" type="button" id="favoriteProductButton">Add to Favorites</button>
            <button class="btn btn-outline-dark flex-fill" type="button" data-message-user="${product.sellerEmail}">Message Seller</button>
        </div>
        <div class="mt-3">
            <label class="form-label" for="productRating">Rate after buying</label>
            <select class="form-select" id="productRating">
                <option value="">Choose rating</option>
                <option value="5">5 stars</option>
                <option value="4">4 stars</option>
                <option value="3">3 stars</option>
                <option value="2">2 stars</option>
                <option value="1">1 star</option>
            </select>
            <div class="small text-muted mt-1" id="productRatingSummary">${getRatingSummary(product.id)}</div>
        </div>
    `;

    cartButton.insertAdjacentElement("afterend", actions);

    const favoriteButton = document.getElementById("favoriteProductButton");
    const ratingSelect = document.getElementById("productRating");
    const canRate = hasCurrentUserBoughtProduct(product.name);

    updateFavoriteButton(favoriteButton, product.id);

    if (!canRate) {
        ratingSelect.disabled = true;
        document.getElementById("productRatingSummary").textContent = "Buy this item before rating it.";
    }

    favoriteButton.addEventListener("click", function () {
        toggleFavoriteProduct(product);
        updateFavoriteButton(favoriteButton, product.id);
    });

    ratingSelect.addEventListener("change", function () {
        saveProductRating(product, Number(ratingSelect.value));
    });
}

function getCurrentProductFromPage() {
    const heading = document.querySelector("section h2");
    const price = document.querySelector(".text-success");
    const image = document.querySelector("section img");

    if (!heading || !price || !image) {
        return null;
    }

    const name = heading.textContent.trim().replace(/\s+/g, " ");
    const builtIn = BUILT_IN_PRODUCTS.find(function (product) {
        return normalizeProductName(product.name) === normalizeProductName(name);
    });

    return {
        ...(builtIn || {}),
        id: builtIn ? builtIn.id : normalizeProductName(name),
        name: builtIn ? builtIn.name : name,
        price: Number(price.textContent.replace(/[^0-9.]/g, "")) || 0,
        image: image.getAttribute("src") || "",
        link: window.location.pathname.split("/").pop(),
        sellerEmail: builtIn ? builtIn.sellerEmail : "demo@hustlehub.co.za"
    };
}

function isCurrentUserListingOwner(listing) {
    const currentUserEmail = getCurrentUserEmail();

    return listing && listing.sellerEmail && currentUserEmail && listing.sellerEmail === currentUserEmail;
}

function addToCart() {
    const product = getCurrentProductFromPage();

    if (!product) {
        window.alert("Unable to find product information.");
        return;
    }

    if (isCurrentUserListingOwner(product)) {
        window.alert("You cannot add your own listing to the cart.");
        return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const alreadyExists = cart.find(item => normalizeProductName(item.name) === normalizeProductName(product.name));

    if (alreadyExists) {
        window.alert("This product is already in your cart.");
        return;
    }

    cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        sellerEmail: product.sellerEmail || ""
    });

    localStorage.setItem("cart", JSON.stringify(cart));
    window.location.href = "cart.html";
}

function normalizeProductName(name) {
    return String(name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function isCurrentUserAdmin() {
    const user = getCurrentUser();

    return user && user.roleId === "admin";
}

function getFavorites() {
    try {
        return JSON.parse(localStorage.getItem("hustleHubFavorites")) || [];
    } catch (error) {
        return [];
    }
}

function toggleFavoriteProduct(product) {
    const currentUser = getCurrentUser();

    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }

    const favorites = getFavorites();
    const exists = favorites.some(function (favorite) {
        return favorite.userEmail === currentUser.email && favorite.productId === product.id;
    });
    const updatedFavorites = exists
        ? favorites.filter(function (favorite) {
            return !(favorite.userEmail === currentUser.email && favorite.productId === product.id);
        })
        : favorites.concat({
            userEmail: currentUser.email,
            productId: product.id,
            product: product,
            addedAt: new Date().toISOString()
        });

    localStorage.setItem("hustleHubFavorites", JSON.stringify(updatedFavorites));
}

function updateFavoriteButton(button, productId) {
    const currentUser = getCurrentUser();
    const isFavorite = currentUser && getFavorites().some(function (favorite) {
        return favorite.userEmail === currentUser.email && favorite.productId === productId;
    });

    button.textContent = isFavorite ? "Remove Favorite" : "Add to Favorites";
}

function loadFavoriteListings() {
    const favoritesGrid = document.getElementById("favoritesGrid");

    if (!favoritesGrid) {
        return;
    }

    const currentUser = getCurrentUser();
    const favorites = getFavorites().filter(function (favorite) {
        return currentUser && favorite.userEmail === currentUser.email;
    });

    favoritesGrid.innerHTML = "";

    if (favorites.length === 0) {
        favoritesGrid.innerHTML = '<p class="text-muted mb-0">No favorites saved yet.</p>';
        return;
    }

    favorites.forEach(function (favorite) {
        favoritesGrid.appendChild(createListingCard(favorite.product, "col-md-6", false));
    });
}

function loadProfileRatings() {
    const ratingSummary = document.getElementById("profileRatingSummary");

    if (!ratingSummary) {
        return;
    }

    const viewedEmail = new URLSearchParams(window.location.search).get("user");
    const currentUser = getCurrentUser();
    const profileEmail = viewedEmail || (currentUser ? currentUser.email : "");
    const user = getStoredUsers().find(function (storedUser) {
        return storedUser.email === profileEmail;
    });

    if (!user) {
        ratingSummary.textContent = "No ratings yet";
        return;
    }

    ratingSummary.innerHTML = getUserRatingSummaryMarkup(user.email);
}

function getUserRatingSummaryMarkup(userEmail) {
    const productIds = BUILT_IN_PRODUCTS.filter(function (product) {
        return product.sellerEmail === userEmail;
    }).map(function (product) {
        return product.id;
    });
    const listingIds = getStoredListings().filter(function (listing) {
        return listing.sellerEmail === userEmail;
    }).map(function (listing) {
        return String(listing.id);
    });
    const ownedProductIds = productIds.concat(listingIds);
    const ratings = getRatings().filter(function (rating) {
        return ownedProductIds.includes(String(rating.productId));
    });

    if (ratings.length === 0) {
        return "No ratings yet";
    }

    const average = ratings.reduce(function (total, rating) {
        return total + Number(rating.rating);
    }, 0) / ratings.length;

    return '<span class="star-rating" aria-label="' + average.toFixed(1) + ' out of 5 stars">' +
        getStarRating(average) +
        '</span> <span class="text-muted small">' + average.toFixed(1) + " (" + ratings.length + ")</span>";
}

function getStarRating(average) {
    const rounded = Math.round(average);
    let stars = "";

    for (let index = 1; index <= 5; index += 1) {
        stars += index <= rounded ? "★" : "☆";
    }

    return stars;
}

function getRatings() {
    try {
        return JSON.parse(localStorage.getItem("hustleHubRatings")) || [];
    } catch (error) {
        return [];
    }
}

function hasCurrentUserBoughtProduct(productName) {
    const currentUser = getCurrentUser();

    if (!currentUser) {
        return false;
    }

    const orders = JSON.parse(localStorage.getItem("hustleHubOrders")) || [];

    return orders.some(function (order) {
        const customerEmail = order.customer ? order.customer.email : "";
        const belongsToUser = order.customerId === currentUser.id || customerEmail === currentUser.email;
        const hasProduct = Array.isArray(order.items) && order.items.some(function (item) {
            return normalizeProductName(item.name) === normalizeProductName(productName);
        });

        return belongsToUser && hasProduct;
    });
}

function saveProductRating(product, rating) {
    const currentUser = getCurrentUser();
    const summary = document.getElementById("productRatingSummary");

    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }

    if (!rating) {
        return;
    }

    const ratings = getRatings().filter(function (item) {
        return !(item.userEmail === currentUser.email && item.productId === product.id);
    });

    ratings.push({
        userEmail: currentUser.email,
        productId: product.id,
        rating: rating,
        ratedAt: new Date().toISOString()
    });

    localStorage.setItem("hustleHubRatings", JSON.stringify(ratings));

    if (summary) {
        summary.textContent = getRatingSummary(product.id);
    }
}

function getRatingSummary(productId) {
    const ratings = getRatings().filter(function (item) {
        return item.productId === productId;
    });

    if (ratings.length === 0) {
        return "No ratings yet.";
    }

    const average = ratings.reduce(function (total, item) {
        return total + Number(item.rating);
    }, 0) / ratings.length;

    return average.toFixed(1) + " stars from " + ratings.length + " rating(s).";
}

function isProductSold(product) {
    const soldProducts = JSON.parse(localStorage.getItem("hustleHubSoldProducts")) || [];

    return soldProducts.includes(product.id) || getStoredListings().some(function (listing) {
        return normalizeProductName(listing.name) === normalizeProductName(product.name) && listing.sold;
    });
}

function setupMessagesPage() {
    const conversationList = document.getElementById("conversationList");
    const messageForm = document.getElementById("messageForm");
    const recipientSelect = document.getElementById("messageRecipient");

    if (!conversationList || !messageForm) {
        return;
    }

    const currentUser = getCurrentUser();

    if (!currentUser) {
        document.getElementById("messageLoginPrompt").classList.remove("d-none");
        messageForm.classList.add("d-none");
        return;
    }

    const targetEmail = new URLSearchParams(window.location.search).get("user") || "";

    renderConversations(currentUser.email, targetEmail);
    prefillMessageRecipient(targetEmail);

    messageForm.addEventListener("submit", function (event) {
        event.preventDefault();
        sendMessage(messageForm);
    });

    if (recipientSelect) {
        recipientSelect.addEventListener("change", function () {
            renderMessageThread(currentUser.email, recipientSelect.value);
        });
    }
}

function getMessages() {
    try {
        return JSON.parse(localStorage.getItem("hustleHubMessages")) || [];
    } catch (error) {
        return [];
    }
}

function prefillMessageRecipient(email) {
    const recipientSelect = document.getElementById("messageRecipient");
    const currentUser = getCurrentUser();
    const users = getStoredUsers().filter(function (user) {
        return currentUser && user.email !== currentUser.email && (currentUser.roleId === "admin" || user.roleId !== "admin");
    });

    recipientSelect.innerHTML = '<option value="">Choose a user</option>';

    users.forEach(function (user) {
        const option = document.createElement("option");

        option.value = user.email;
        option.textContent = user.fullName + " (" + user.email + ")";
        recipientSelect.appendChild(option);
    });

    recipientSelect.value = email;
}

function renderConversations(currentEmail, selectedEmail) {
    const conversationList = document.getElementById("conversationList");
    const messages = getMessages().filter(function (message) {
        return message.from === currentEmail || message.to === currentEmail;
    });
    const conversations = [];

    messages.forEach(function (message) {
        const otherEmail = message.from === currentEmail ? message.to : message.from;
        const existing = conversations.find(function (conversation) {
            return conversation.email === otherEmail;
        });

        if (!existing || new Date(message.sentAt) > new Date(existing.latest.sentAt)) {
            if (existing) {
                existing.latest = message;
            } else {
                conversations.push({ email: otherEmail, latest: message });
            }
        }
    });

    conversationList.innerHTML = "";

    if (conversations.length === 0) {
        conversationList.innerHTML = '<p class="text-muted mb-0">No messages yet.</p>';
    }

    conversations.forEach(function (conversation) {
        const user = getStoredUsers().find(function (item) {
            return item.email === conversation.email;
        }) || { fullName: conversation.email, avatar: "" };
        const item = document.createElement("button");
        const isSelected = selectedEmail === conversation.email;

        item.className = "list-group-item list-group-item-action d-flex gap-3 align-items-center" + (isSelected ? " active" : "");
        item.type = "button";
        item.innerHTML = `
            ${getAvatarMarkup(user, "profile-thumb")}
            <span class="text-start">
                <strong>${escapeHtml(user.fullName || conversation.email)}</strong><br>
                <span class="small ${isSelected ? "" : "text-muted"}">${escapeHtml(conversation.latest.text)}</span><br>
                <span class="small">${escapeHtml(formatDateTime(conversation.latest.sentAt))} | Last active ${escapeHtml(formatRelativeTime(user.lastActive))}</span>
            </span>
        `;
        item.addEventListener("click", function () {
            document.getElementById("messageRecipient").value = conversation.email;
            renderConversations(currentEmail, conversation.email);
        });
        conversationList.appendChild(item);
    });

    if (selectedEmail) {
        renderMessageThread(currentEmail, selectedEmail);
    }
}

function renderMessageThread(currentEmail, otherEmail) {
    const thread = document.getElementById("messageThread");

    if (!otherEmail) {
        thread.innerHTML = '<p class="text-muted mb-0">Choose a conversation or send a new message.</p>';
        return;
    }

    const messages = getMessages().filter(function (message) {
        return (message.from === currentEmail && message.to === otherEmail) || (message.from === otherEmail && message.to === currentEmail);
    });

    thread.innerHTML = "";

    if (messages.length === 0) {
        thread.innerHTML = '<p class="text-muted mb-0">Start the conversation.</p>';
        return;
    }

    messages.sort(function (a, b) {
        return new Date(a.sentAt) - new Date(b.sentAt);
    }).forEach(function (message) {
        const bubble = document.createElement("div");
        const text = document.createElement("p");
        const meta = document.createElement("span");

        bubble.className = message.from === currentEmail ? "message-bubble message-own" : "message-bubble";
        text.className = "mb-1";
        text.textContent = message.text;
        meta.textContent = formatDateTime(message.sentAt);
        bubble.append(text, meta);
        thread.appendChild(bubble);
    });

    thread.scrollTop = thread.scrollHeight;
}

function sendMessage(form) {
    const currentUser = getCurrentUser();
    const text = form.messageText.value.trim();
    const recipient = form.recipient.value;

    if (!recipient || !text) {
        showMessage("messageStatus", "Choose a user and write a message.", "warning");
        return;
    }

    const messages = getMessages();

    messages.push({
        id: Date.now(),
        from: currentUser.email,
        to: recipient,
        text: text,
        sentAt: new Date().toISOString()
    });

    localStorage.setItem("hustleHubMessages", JSON.stringify(messages));
    touchCurrentUserActivity(currentUser.email);
    form.messageText.value = "";
    showMessage("messageStatus", "Message sent.", "success");
    renderConversations(currentUser.email, recipient);
    renderMessageThread(currentUser.email, recipient);
}

function formatDateTime(value) {
    if (!value) {
        return "No date";
    }

    return new Date(value).toLocaleString("en-ZA", {
        dateStyle: "medium",
        timeStyle: "short"
    });
}

function formatRelativeTime(value) {
    if (!value) {
        return "recently";
    }

    const minutes = Math.max(1, Math.round((Date.now() - new Date(value).getTime()) / 60000));

    if (minutes < 60) {
        return minutes + " min ago";
    }

    return Math.round(minutes / 60) + " hour(s) ago";
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function isValidPhone(phone) {
    return /^[0-9]{10}$/.test(phone);
}

function validateEmailField(field) {
    const email = field.value.trim().toLowerCase();

    if (!isValidEmail(email)) {
        field.setCustomValidity("Please enter a valid email address.");
    }
}

function validatePhoneField(field) {
    const phone = field.value.trim();

    if (!isValidPhone(phone)) {
        field.setCustomValidity("Please enter a 10-digit phone number.");
    }
}

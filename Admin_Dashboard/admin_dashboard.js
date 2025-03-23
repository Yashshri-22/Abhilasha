function loadPage(pageUrl) {
    if (pageUrl === "pages/Logout/Logout.html") {
        window.location.href = "../home/home.html"; 
    } else {
        document.getElementById("mainFrame").src = pageUrl;
    }
}

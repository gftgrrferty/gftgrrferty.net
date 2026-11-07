(function () {
  let flag = false;
  const profileImage = document.getElementById("profile_image");

  profileImage.addEventListener("click", function () {
    if (flag) {
      profileImage.src = "./assets/kaguya-pink.png";
      flag = false;
    } else {
      profileImage.src = "./assets/kipfel.png";
      flag = true;
    }
  });
})();
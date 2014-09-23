

"use strict";

  var slideShow = false;

  /* ------------------------------------------
  FB login status change, load SDK, and Init
  **Change appId before deloyment**
  --------------------------------------------- */
  
  //This is called with the results from from FB.getLoginStatus().
  function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      document.getElementById("navBar").style.display = "inline";
      document.getElementById("login").style.display = "none";
      //var newButton = document.createElement("div");
      //newButton.innerHTML = "Logout";
      document.getElementById("logoutButton").onclick = function(){
        FB.logout(function(response) {
        // Person is now logged out
            });
            location.reload();
      };
      // This function is used to call the FB API for images.
      useFBAPI();
    }
  }

  function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }

  window.fbAsyncInit = function() {
    FB.init({
      //appId      : '933494109999598',   //for locally hosted test App
      appId      : '931973756818300', //for deployment
      cookie     : true,  // enable cookies to allow the server to access 
                          // the session
      xfbml      : true,  // parse social plugins on this page
      version    : 'v2.1' // use version 2.1
    });

    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  };

  // Load the SDK asynchronously
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  /* ------------------------------------------
  CALL FB API and load Images
  --------------------------------------------- */

  function useFBAPI() {
    console.log('Welcome!  Fetching your information.... ');
    
    //get name
    FB.api('/me', function(response) {
      console.log(response);
      console.log('Successful login for: ' + response.name);
      document.getElementById('status').innerHTML = response.name;
    });
    
    //get profile picture
    FB.api('/me?fields=picture.width('+ Math.floor(window.innerWidth/4) +')', function(response) {
      //console.log(response.picture.data.url);
      var newImage = document.createElement("img");
      newImage.src = response.picture.data.url;
      newImage.addEventListener("click", function(){   
        slideShow = true;
        toggleFullScreen();
      }, false);
      document.getElementById("picture").appendChild(newImage);
    });
    
    //get cover photo ID first and then get the imageURL
    FB.api('/me?fields=albums{name}', function(response) {
      var albums = response.albums.data;
      var albumID = null;
      for (var i = 0; i < albums.length; i++) {
        if(albums[i].name === "Cover Photos")
            albumID = albums[i].id;
      }
      FB.api(albumID + '?fields=photos.limit(1)', function(response) {
          console.log(response);
          var imageData = response.photos.data;
          var newImageURL = imageData[0].images[0].source;
          var urlAttribute = "url(" + newImageURL + ")no-repeat center center fixed";
          document.getElementById("backImage").style.backgroundImage = 'url(' + newImageURL + ')';
          document.getElementById("backImage").setAttribute("class", "animated fadeIn");
        });
    });

    /* get recently tagged pictures which: 
          1) are the least greater in width than the screen.width of the device
          2) have width greater than height (design decision for landscape pictures)
    */
    FB.api('/me?fields=photos.limit(30){images}', function(response) {
      console.log(response);
      var imageData = response.photos.data;
      for (var i = 0; i < imageData.length; i++) {
        for (var j = 0; j < imageData[i].images.length; j++) {
          if(imageData[i].images[j].width <= screen.width){
            //console.log(imageData[i].images[j].source);
            if(imageData[i].images[j].height < imageData[i].images[j].width){
              
              //if the image matches then add it to the DOM
              (function () {
                  var newLi = document.createElement("div");
                  var newImage = document.createElement("img");
                  
                  if(j != 0)
                    newImage.src = imageData[i].images[j-1].source;
                  else
                    newImage.src = imageData[i].images[j].source;
                  
                  newImage.addEventListener("click", function(){
                      document.getElementById("backImage").style.backgroundImage = 'url(' + newImage.src +')';
                      console.log(newImage.src);
                      toggleFullScreen();
                  }, false);
                  
                  newLi.appendChild(newImage);
                  document.getElementById("imageList").appendChild(newLi);

                  
              }());
              break;

            }
          }
        }
      } //end of first for loop

      //run function changeURLIfFullScreen() for changing back/fullscreen image after every 3secs
      window.setInterval(changeURLIfFullScreen, 3000);

    });
  } //end of useFBAPI()

/* ------------------------------------------
  FUll screen API
--------------------------------------------- */

  //Toggle full screen when Space is pressed
  document.addEventListener("keydown", function(e) {
  if (e.keyCode == 32) {
    toggleFullScreen();
    }
  }, false);

  function enterFullScreen(){
    document.getElementById('backImage').style.zIndex = 1000; // for instant changes
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  }

  function exitFullScreenMy() {
    document.getElementById('backImage').style.zIndex = -100; // for instant changes
    slideShow = false;
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }

  function toggleFullScreen() {
    if (!document.fullscreenElement &&    // alternative standard method
        !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
      enterFullScreen();
    } else {
      exitFullScreenMy();
    }
  }

  //change z-index of the background image when full screen changes
  function screenChangeHandler() {
    setTimeout(function () {
        if ( window.innerHeight == screen.height){
          document.getElementById('backImage').style.zIndex = 1000;
        }else{
          document.getElementById('backImage').style.zIndex = -100;
          slideShow = false;
        }
    }, 1000); // one second timeout to get correct value of window.innerHeight
  }

  var nextBackImage = 0;
  function changeURLIfFullScreen() {
    if ( window.innerHeight == screen.height && slideShow){
      console.log("fired");
      var total = document.getElementById("imageList").children.length;
      var nextImageSrc = document.getElementById("imageList").children[nextBackImage].children[0].src;
      
      document.getElementById("backImage").style.backgroundImage = 'url(' + nextImageSrc +')';

      nextBackImage++;
      nextBackImage %= total;
    }
  }
  
  //event handlers when the full screen changes 
  document.addEventListener('webkitfullscreenchange', screenChangeHandler, false);
  document.addEventListener('mozfullscreenchange', screenChangeHandler, false);
  document.addEventListener('fullscreenchange', screenChangeHandler, false);
  document.addEventListener('MSFullscreenChange', screenChangeHandler, false);

  document.getElementById("logo").children[0].addEventListener("click", function(){   
        slideShow = true;
        toggleFullScreen();
      }, false);

  /* ------------------------------------------
  NAVIGATION
  --------------------------------------------- */
  var navigation = responsiveNav(".nav-collapse", {
        animate: true,                    // Boolean: Use CSS3 transitions, true or false
        transition: 284,                  // Integer: Speed of the transition, in milliseconds
        label: "Menu",                    // String: Label for the navigation toggle
        insert: "after",                  // String: Insert the toggle before or after the navigation
        customToggle: "",                 // Selector: Specify the ID of a custom toggle
        closeOnNavClick: false,           // Boolean: Close the navigation when one of the links are clicked
        openPos: "relative",              // String: Position of the opened nav, relative or static
        navClass: "nav-collapse",         // String: Default CSS class. If changed, you need to edit the CSS too!
        navActiveClass: "js-nav-active",  // String: Class that is added to <html> element when nav is active
        jsClass: "js",                    // String: 'JS enabled' class which is added to <html> element
        init: function(){},               // Function: Init callback
        open: function(){},               // Function: Open callback
        close: function(){}               // Function: Close callback
      }); 


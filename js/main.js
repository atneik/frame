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
 
 // This is called with the results from from FB.getLoginStatus().
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
    appId      : '931973756818300',
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

  function useFBAPI() {
    console.log('Welcome!  Fetching your information.... ');
    
    FB.api('/me', function(response) {
      console.log(response);
      console.log('Successful login for: ' + response.name);
      document.getElementById('status').innerHTML = response.name;
    });
 
    FB.api('/me?fields=picture.width('+ Math.floor(window.innerWidth/4) +')', function(response) {
      //console.log(response.picture.data.url);
      var newImage = document.createElement("img");
      newImage.src = response.picture.data.url;
      document.getElementById("picture").appendChild(newImage);
    });
    
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
      //console.log(response.photos.data);
          newImageURL = imageData[0].images[0].source;
              var urlAttribute = "url(" + newImageURL + ")no-repeat center center fixed";
              document.getElementById("backImage").style.backgroundImage = 'url(' + newImageURL + ')';
              document.getElementById("backImage").setAttribute("class", "animated fadeIn");
        });
    });

    FB.api('/me?fields=photos.limit(30){images}', function(response) {
      var imageData = response.photos.data;
      //console.log(response.photos.data);
      for (var i = 0; i < imageData.length; i++) {
        for (var j = 0; j < imageData[i].images.length; j++)
          
        if(imageData[i].images[j].width <= screen.width){
          //console.log(imageData[i].images[j].source);
          if(imageData[i].images[j].height < imageData[i].images[j].width){
          
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

      //console.log(image);

    });

  }

  document.addEventListener("keydown", function(e) {
  if (e.keyCode == 13) {
    toggleFullScreen();
    }
  }, false);

  function enterFullScreen(){
    document.getElementById('backImage').style.zIndex = 1000;
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

  document.addEventListener('webkitfullscreenchange', exitHandler, false);
  document.addEventListener('mozfullscreenchange', exitHandler, false);
  document.addEventListener('fullscreenchange', exitHandler, false);
  document.addEventListener('MSFullscreenChange', exitHandler, false);

  function exitHandler()
  {
    setTimeout(function () {
        if ( window.innerHeight == screen.height){
          document.getElementById('backImage').style.zIndex = 1000;
        }else{
          document.getElementById('backImage').style.zIndex = -100;
        }
    }, 1000);
  }

  function exitFullScreenMy(){
    document.getElementById('backImage').style.zIndex = -100;
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

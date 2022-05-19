require.config({
    shim: {
      'facebook' : {
        exports: 'FB'
      }
    },
    paths: {
      'facebook': 'https://connect.facebook.net/en_US/sdk.js'
    }
  })
  require(['fb']);
  FB.api(
    '/2183335061829780_1962147367281885',
    'GET',
    {"fields":"reactions.summary(total_count)"},
    function(response) {
        // Insert your code here
    }
  );
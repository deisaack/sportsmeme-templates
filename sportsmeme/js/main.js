$(function() {
  var $queryParams = window.location.search.replace('?', '');
  var liveUrl = window.location.origin;
  var $postsList = $('#postsList');
  var $currentPosts = undefined;
  var $categoryList = $('#categoryList');
  var $popularVideos = $('#popularVideos');
  var $popularVideoTemplate = '' +
    '<div class="col-sm-3">\n' +
    '  <div class="row inner m0">\n' +
    '    <div class="preview_img">\n' +
    '      <img src="{{image}}" alt="" style="height: 100px" class="preview">\n' +
    '      <a href="/post/?id={{id}}" class="play-btn"></a>\n' +
    '    </div>\n' +
    '    <div class="title_row row m0"><a href="{{address}}">{{caption}}</a></div>\n' +
    '  </div>\n' +
    '</div>';
  var $postTemplate = '<article class="col-sm-3 video_post {{postType}}">\n' +
    '  <div class="inner row m0">\n' +
    '    <a href="{{address}}"><div class="row screencast m0">\n' +
    '      <img src="{{image}}" alt="" class="cast img-responsive">\n' +
    '      <div class="{{btnClass}}"></div>\n' +
    '      <div class="media-length"></div>\n' +
    '    </div></a>\n' +
    '    <div class="row m0 post_data">\n' +
    '      <div class="row m0"><a href="{{address}}" class="post_title">{{caption}}</a></div>\n' +
    '      <div class="row m0">\n' +
    // '        <div class="fleft author">by <a href="page-author.html"></a></div>\n' +
    '<div class="fb-share-button" data-href="{{address}}" data-layout="button_count" data-size="small" data-mobile-iframe="true"><a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fplugins%2F&amp;src=sdkpreparse" class="fb-xfbml-parse-ignore">Share</a></div>'+
    // '        <div class="fleft date">{{created}}</div>\n' +
    // '      <time class="timeago" datetime="{{created}}">{{created}}</time>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '    <div class="row m0 taxonomy">\n' +
    '      <div class="fleft category"><a href="#"><img src="images/icons/cat.png" alt="">Like</a></div>\n' +
    '      <div class="fright views"><a href="#"><img src="images/icons/views.png" alt="">{{views}}</a></div>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '</article>';
  function addPost(post){
    $postsList.append(Mustache.render($postTemplate, post));
  }
  function addPopularVideo(post){
    $popularVideos.append(Mustache.render($popularVideoTemplate, post));
  }
  $.ajax({
    type: 'GET',
    url: 'https://api.addictaf.com/posts/post/?category=SPORTSMEME&limit=22&'+$queryParams,
    success: function (data) {
      $currentPosts = data;
      $.each(data.results, function (i, post) {
          post.address = liveUrl + '/post/?id='+post.id;
          if (post.is_video){
            post.btnClass = 'play_btn'
          } else {
            post.btnClass = 'img_btn'
          }
          let mod = i%3;
          switch (mod) {
            case 1:
              post.postType = 'postType4';
              break;
            case 2:
              post.postType = 'postType2';
              break;
            case 0:
              post.postType = 'postType3';
              break;
            default:
              alert(mod);
          }
          addPost(post);
      });
    }, error: function (data) {
      alert('Error fetching posts');
    }
  });

  function loadMore() {
    if ($currentPosts !== undefined) {
      $.ajax({
        type: 'GET',
        url: $currentPosts.next,
        success: function (data) {
          $.each(data.results, function (i, post) {
            post.address = liveUrl + '/post/?id='+post.id;
            let mod = i % 3;
            if (post.is_video){
              post.btnClass = 'play_btn'
            } else {
              post.btnClass = 'img_btn'
            }
            switch (mod) {
              case 1:
                post.postType = 'postType4';
                break;
              case 2:
                post.postType = 'postType2';
                break;
              case 0:
                post.postType = 'postType3';
                break;
              default:
                alert(mod);
            }
            addPost(post);
          });
        }, error: function (data) {
          alert('Error fetching posts');
        }
      });
    }
  }

  $("#loadMore").click(function() {
    loadMore()
  });

  function addCattegory(category) {
    $categoryList.append(
      '<li><a href="?tags='+category+'"><span class="filter_text">'+category+'</span><span class="badge"></span></a></li>'
    )
  }
  $.ajax({
    type: 'GET',
    url: 'https://api.addictaf.com/posts/all-tags/',
    success: function (data) {
      $.each(data, function (i, tag) {
        addCattegory(tag);
      });
    }, error(){
      console.log("Failed to load Tags")
    }
  });
  $.ajax({
    type: 'GET',
    url: 'https://api.addictaf.com/posts/post/?category=SPORTSMEME&is_video=1&limit=4&'+$queryParams,
    success: function (data) {
      $.each(data.results, function (i, post) {
        post.address = liveUrl + '/post/?id='+post.id;
        addPopularVideo(post);
      });
    }, error(){
      console.log("Failed to load Tags")
    }
  });
});

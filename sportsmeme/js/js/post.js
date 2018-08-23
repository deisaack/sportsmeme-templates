$(function() {
  var $post = undefined;
  var x = window.location.search.split('&');
  var $postContent = $('#postContent');
  var $videoPostTemplate = '' +
    '<div class="author_details post_details row m0">\n' +
    '  <div class="embed-responsive embed-responsive-16by9">\n' +
    '    <video controls autoplay>\n' +
    '  <source src="{{video}}" type="video/mp4">\n' +
    'Your browser does not support the video tag.\n' +
    '</video>' +
    '  </div>\n' +
    '  <div class="row post_title_n_view">\n' +
    '    <h2 class="col-sm-8 post_title">{{caption}}</h2>\n' +
    '        <div class="fb-share-button" data-layout="button_count" data-size="small" data-mobile-iframe="true"><a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fplugins%2F&amp;src=sdkpreparse" class="fb-xfbml-parse-ignore">Share</a></div>\n' +
    '    <h2 class="col-sm-4 view_count">{{views}} <small>Views</small></h2>\n' +
    '  </div>\n' +
    '</div>\n'+'' +'' +
    '        <div class="fb-comments" data-numposts="8"></div>\n';
  var $imagePostTemplate =  '' +
    '<div class="author_details post_details row m0">\n' +
    '  <div class="embed-responsive embed-responsive-16by9">\n' +
    '    <img src="{{image}}" class="img-responsive img">\n' +
    '  </div>\n' +
    '  <div class="row post_title_n_view">\n' +
    '    <h2 class="col-sm-8 post_title">{{caption}}</h2>\n' +
    '        <div class="fb-share-button" data-layout="button_count" data-size="small" data-mobile-iframe="true"><a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fplugins%2F&amp;src=sdkpreparse" class="fb-xfbml-parse-ignore">Share</a></div>\n' +
    '    <h2 class="col-sm-4 view_count">{{views}} <small>Views</small></h2>\n' +
    '  </div>\n' +
    '</div>\n'+'' +
    '        <div class="fb-comments" data-numposts="8"></div>\n';

  for(var i=0; i< x.length; i++){
    let item = x[i];
    if (item.includes('id=')){
      item = item.split('=')[1];
      console.log('The id is '+ item);
      $.ajax({
        type: 'GET',
        url: 'https://api.addictaf.com/posts/post/'+item+'/',
        success: function (data) {
          $post = data;
          // $postContent.html('Lorem lipsum dolor sit amet');
          if (data.is_video) {
            $postContent.html(Mustache.render($videoPostTemplate, $post));
          } else {
            $postContent.html(Mustache.render($imagePostTemplate, $post))
          }
        }, error(){
          console.log("Failed to load Tags")
        }
      });
      break
    }
  }
  var $queryParams = window.location.search.replace('?', '');
  var liveUrl = window.location.origin;
  var $postsList = $('#postsList');
  var $currentPosts = undefined;
  var $categoryList = $('#categoryList');
  var $popularVideos = $('#popularVideos');
  var $recommended = $('#recommended');
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
  var $recommendedTemplate = '' +
    '<div class="media">\n' +
    '  <div class="media-left"><a href="{{address}}"><img src="{{image}}" alt=""><span class="duration"></span></a></div>\n' +
    '  <div class="media-body">\n' +
    '    <a href="{{address}}">\n' +
    '      <h5>{{caption}}</h5>\n' +
    '    </a>\n' +
    '    <div class="row m0 meta_info views">{{views}} views</div>\n' +
    '    <div class="row m0 meta_info posted">3 hrs ago</div>\n' +
    '  </div>\n' +
    '</div>';
  function addPost(post){
    $postsList.append(Mustache.render($postTemplate, post));
  }
  function addPopularVideo(post){
    $popularVideos.append(Mustache.render($popularVideoTemplate, post));
  }
  function addRecommended(post){
    $recommended.append(Mustache.render($recommendedTemplate, post));
  }
  $.ajax({
    type: 'GET',
    url: 'https://api.addictaf.com/posts/post/?category=SPORTSMEME&limit=5&'+$queryParams,
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
        addRecommended(post);
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
          $currentPosts.next = data.next;
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

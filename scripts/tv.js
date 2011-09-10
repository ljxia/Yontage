// make div a tv
var TV_CONFIG = [
  {
    width: '640',
    height: '480'
  },
  {
    width: '430',
    height: '330'
  },
  {
    width: '215',
    height: '165'
  }
];


$.fn.TVSet = function() {
  
  if (!this.attr('id'))
  {
    this.tv_id = getUID(6);
    this.attr("id", "tv-" + this.tv_id);
  }
  
  return $.extend(this,{
    tv_id:0,
    tv_type: 2,
    done: false,
        
    init:function(video_id){
      player_id = "pl-" + this.tv_id;
      this.addClass("tv tv" + this.tv_type);
      $('<div class="chrome"></div>').appendTo(this);
      $('<div class="player" id="' + player_id + '"></div>').appendTo(this);
      
      var player = new YT.Player(player_id, {
        width: TV_CONFIG[this.tv_type].width,
        height: TV_CONFIG[this.tv_type].height,
        videoId: video_id,     
        playerVars:{
          enablejsapi:1,
          controls: 0,
          html5:1,
          autoplay:0,
          loop:1
        },
        events: {
          'onReady': this.onPlayerReady,
          'onStateChange': this.onPlayerStateChange,
          'onError':this.onPlayerError
        }
      });
      
      this.data('player',player);
      
      return this;
    },
    
    onPlayerReady:function(event) {
      console.log("Player ready");
      // $(".tv").css({width:event.target.b.width, height:event.target.b.height});
      // $(".screen").css({width:event.target.b.width, height:event.target.b.height});
      //event.target.playVideo();
    },
    
    onPlayerStateChange:function(event) {
      if (event.data == YT.PlayerState.PLAYING && !this.done) {
        //setTimeout(stopVideo, 6000);
        this.done = true;
      }
    },
    
    onPlayerError:function(event){
      console.log(event);
    },
    
    getPlayer:function(){
      return this.data('player');
    },
    
    stopVideo:function() {
      this.getPlayer().stopVideo();
    },
    
    playVideo:function() {
      this.getPlayer().playVideo();
    },
    
    handleMouseMove:function(mouseX, mouseY){
      var s,t,distanceX, distanceY;
      var left = parseInt(this.css('left').replace('px',''));
      var top = parseInt(this.css('top').replace('px',''));
      
      distanceX = Math.abs(left + this.width()/2 - mouseX);
      s = mapRange(distanceX, (this.width() * 0.25), (this.width() * 1.5), 10, 0);
      distanceY = Math.abs(top + this.height()/2 - mouseY);
      t = mapRange(distanceX, (this.height() * 0.25), (this.height() * 1.5), 10, 0);
      
      this.getPlayer().setVolume(s*t);
    }
    
  });
};
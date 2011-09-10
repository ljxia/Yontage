// make div a tv
var TV_CONFIG = [
  {
    width: '640',
    height: '480'
  },
  {
    width: '430',
    height: '330'
  }
];


$.fn.TVSet = function() {
  this.tv_id = getUID(6);
  this.attr("id", "tv-" + this.tv_id);
  
  return $.extend(this,{
    tv_type: 1,
    player: null,
    done: false,
        
    init:function(video_id){
      player_id = "pl-" + this.tv_id;
      this.addClass("tv" + this.tv_type);
      $('<div class="chrome"></div>').appendTo(this);
      $('<div class="player" id="' + player_id + '"></div>').appendTo(this);
      
      this.player = new YT.Player(player_id, {
        width: TV_CONFIG[this.tv_type].width,
        height: TV_CONFIG[this.tv_type].height,
        videoId: video_id,     
        playerVars:{
          enablejsapi:1,
          controls: 0,
          html5:1,
          autoplay:1,
          loop:1
        },
        events: {
          'onReady': this.onPlayerReady,
          'onStateChange': this.onPlayerStateChange,
          'onError':this.onPlayerError
        }
      });
      
      return this;
    },
    
    onPlayerReady:function(event) {
      console.log("player ready");
      // $(".tv").css({width:event.target.b.width, height:event.target.b.height});
      // $(".screen").css({width:event.target.b.width, height:event.target.b.height});
      event.target.playVideo();
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
    
    stopVideo:function() {
      this.player.stopVideo();
    }
    
  });
};
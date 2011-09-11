// make div a tv
var TV_CONFIG = [
  // {    
  //   type: 0,
  //   vbounds:[320,180],
  //   poi:[0,0,320,180] //
  // },
  {            
    type: 1,
    vbounds:[430,330],
    poi:[6,213,590,430] // 
  },   
  { 
    type: 2,
    vbounds:[215,165],
    poi:[2,107,295,215]
  },
  {        
    type: 3,
    vbounds:[149,108],
    poi:[2,10,236,175]
  },   
  {        
    type: 4,
    vbounds:[231,174],
    poi:[4,97,314,211]
  },
  {        
    type: 5,
    vbounds:[164,139],
    poi:[0,0,164,139]
  },
  {        
    type: 6,
    vbounds:[290,220],
    poi:[5,0,391,323]
  },
  {        
    type: 7,
    vbounds:[202,174],
    poi:[3,114,309,227]
  },
  {        
    type: 8,
    vbounds:[268,197],
    poi:[0,0,430,293]
  }
];


$.fn.TVSet = function() {
  
  if (!this.attr('id'))
  {
    this.tv_id = getUID(6);
    this.attr("id", "tv-" + this.tv_id);
  }
  
  return $.extend(this,{
    done: false,
        
    init:function(video_id){  
      
      if (Math.random() <= 0.1)
      {
        this.tv_type = 0;
      }                  
      else
      {
        this.tv_type = Math.floor(Math.random()* (TV_CONFIG.length - 1) + 1);
      }
      
      
      player_id = "pl-" + this.tv_id;
      this.addClass("tv tv" + TV_CONFIG[this.tv_type].type);
      $('<div class="chrome"></div>').appendTo(this);
      $('<div class="player" id="' + player_id + '"></div>').appendTo(this);
      // $('<div class="shadow"></div>').appendTo(this);
      
      var player = new YT.Player(player_id, {
        width: TV_CONFIG[this.tv_type].vbounds[0],
        height: TV_CONFIG[this.tv_type].vbounds[1],
        videoId: video_id,     
        playerVars:{
          enablejsapi:1,
          controls: 0,
          html5:1,
          autoplay:0,
          loop:1,
          origin:window.location.host
        },
        events: {
          'onReady': this.onPlayerReady,
          'onStateChange': this.onPlayerStateChange,
          'onError':this.onPlayerError
        }
      });
      
      this.data('vbounds',TV_CONFIG[this.tv_type].vbounds);
      this.data('poi',TV_CONFIG[this.tv_type].poi)
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
      console.log("Player error (switch to next video)");
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
            
      var left = this[0].offsetLeft + this.data('poi')[0];
      var top = this[0].offsetTop + this.data('poi')[1];      
      // var left = this.css('left').replace('px','') + this.data('poi')[0];
      // var top = this.css('top').replace('px','') + this.data('poi')[1];  
      var width = this.data('poi')[2];
      var height = this.data('poi')[3];
      
      distanceX = Math.abs(left + width/2 - mouseX);
      s = mapRange(distanceX, (width * 0.25), (width * 1.2), 10, 0);
      distanceY = Math.abs(top + height/2 - mouseY);
      t = mapRange(distanceY, (height * 0.25), (height * 1.2), 10, 0);
      
      this.getPlayer().setVolume(s*t);//s*t
      
      
      s = mapRange(distanceX, (width * 0.25), (width * 1.3), 10, 0);
      t = mapRange(distanceY, (height * 0.25), (height * 1.3), 10, 0);
      if (s * t == 0)
      {
        this.getPlayer().pauseVideo();
      }
      else
      {
        this.getPlayer().playVideo();
      }   
    },
    
    handleWindowScroll:function(window_top, window_bottom){

      // 
      // this_top = this[0].offsetTop + this.data('poi')[1] + this.data('poi')[3]/4;
      // this_bottom = this_top + this.data('poi')[3] - this.data('poi')[3]/4;       
      // 
      // if (this_bottom >= window_top && this_top <= window_bottom)
      // {
      //    this.getPlayer().playVideo();
      // }    
      // else
      // {
      //   this.getPlayer().pauseVideo();
      // }   
    }
    
  });
};
window.onload = function(){
  var gauge = loadLiquidFillGauge("fillgauge", 60.1, config);
  var config = liquidFillGaugeDefaultSettings();
  config.textVertPosition = 0.8;
  config.waveAnimateTime = 5000;
  config.waveHeight = 0.15;
  config.waveAnimate = false;
  config.waveOffset = 0.25;
  config.valueCountUp = false;
  config.displayPercent = false;

  function NewValue(){
    if(Math.random() > .5){
      return Math.round(Math.random()*100);
    } else {
      return (Math.random()*100).toFixed(1);
    }
  }
}

var plugin_key ="chuantong.huang@gmail.com-donwloader"

var defaultOption={
  enable_me : false,
  mini_content_length:1024*1024,
  save_dir: "/MP3/",
  file_extends:'.*mp3',
  domain_urls:"<all_urls>"
}

function Options(data){
  if (data){
    console.log("init the plugin",data)
    document.getElementById('enable_me').checked = data.enable_me
    document.getElementById('mini_content_length').value = data.mini_content_length
    document.getElementById('save_dir').value = data.save_dir
    document.getElementById('file_extends').value = data.file_extends
    document.getElementById('domain_urls').value = data.domain_urls
  }
}


function loadRules() {
  var opts = localStorage.getItem(plugin_key);
  try {
    new Options(JSON.parse(opts));
    return JSON.parse(opts)
  } catch (e) {
    console.log("used defaultOption")
    new Options(defaultOption)
    localStorage.setItem(plugin_key, JSON.stringify(defaultOption));
    return defaultOption
  }
}

window.onload = function() {
  loadRules();

  document.getElementById('submit').onclick = function() {
    var file_extends = document.getElementById('file_extends').value;
    try{
      reg = new RegExp(file_extends)
    }catch(e){
        document.getElementById('save-result').innerHTML=e.toString()
        return
    }

    var length = parseInt(document.getElementById('mini_content_length').value);
    length = isNaN(length) ? 1024*1024 : length;

    var save = document.getElementById('save_dir').value
    if (!save.endsWith('/')){
      document.getElementById('save_dir').value = save  +'/'
    }

    var opt = {
      enable_me:document.getElementById('enable_me').checked,
      mini_content_length:length, 
      save_dir: document.getElementById('save_dir').value,
      file_extends:document.getElementById('file_extends').value,
      domain_urls: document.getElementById('domain_urls').value
    }
    localStorage.setItem(plugin_key, JSON.stringify(opt));

    chrome.extension.sendRequest(opt)
    document.getElementById('save-result').innerHTML='Save Config OK.'
    console.log(opt)
  };
}

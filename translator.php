<?php
  $name = basename($_SERVER["REQUEST_URI"]);

  if (stripos($name, "?") !== false) {
    $name = strstr($name, "?", true);
  }
  $url = "https://en.pons.com/translate/" . urlencode($name) . "/";
  if (isset($_REQUEST["q"])) {
    $url = $url . urlencode($_REQUEST["q"]);
  }
  else {
    $url = $url . "dummy";
  }
  $content = file_get_contents($url);

  if ($content == false) {
    print("b<head><meta http-equiv=\"Refresh\" content=\"0; url='https://github.com/JulianWww/FrenchPons-Proxy/blob/main/README.md'\" /></head>");
  }

  $content = str_replace("https://cdn.cookielaw.org/scripttemplates/otSDKStub.js", "", $content);
  $content = str_replace("<head>", "<head><script src=\"./script.js\"></script>", $content);

  print($content);
?>

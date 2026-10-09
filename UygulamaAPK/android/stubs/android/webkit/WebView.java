package android.webkit;
public class WebView extends android.view.View {
  public WebView(android.content.Context c) { super(c); }
  public WebSettings getSettings() { throw new RuntimeException(); }
  public void setWebViewClient(WebViewClient c) { throw new RuntimeException(); }
  public void setWebChromeClient(WebChromeClient c) { throw new RuntimeException(); }
  public void loadUrl(String u) { throw new RuntimeException(); }
  public void addJavascriptInterface(Object o, String n) { throw new RuntimeException(); }
  public boolean canGoBack() { throw new RuntimeException(); }
  public void goBack() { throw new RuntimeException(); }
}

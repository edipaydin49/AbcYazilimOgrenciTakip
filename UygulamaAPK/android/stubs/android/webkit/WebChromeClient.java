package android.webkit;
public class WebChromeClient {
  public WebChromeClient() {}
  public interface CustomViewCallback { void onCustomViewHidden(); }
  public void onShowCustomView(android.view.View v, CustomViewCallback c) {}
  public void onHideCustomView() {}
}

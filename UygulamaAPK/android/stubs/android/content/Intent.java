package android.content;
public class Intent {
  public static final String ACTION_SEND = "android.intent.action.SEND";
  public static final String EXTRA_TEXT = "android.intent.extra.TEXT";
  public static final String EXTRA_SUBJECT = "android.intent.extra.SUBJECT";
  public Intent(String a) { throw new RuntimeException(); }
  public Intent putExtra(String n, String v) { throw new RuntimeException(); }
  public Intent setType(String t) { throw new RuntimeException(); }
  public static Intent createChooser(Intent t, CharSequence title) { throw new RuntimeException(); }
}

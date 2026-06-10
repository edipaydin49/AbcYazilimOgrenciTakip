using AbcYazilim.OgrenciTakip.UI.Win.Interfaces;
using DevExpress.Utils;
using DevExpress.XtraBars.Ribbon;
using System.ComponentModel;

namespace AbcYazilim.OgrenciTakip.UI.Win.UserControls.Controls
{
    [ToolboxItem(true)]
    public class myRibbonControl : RibbonControl, IStatusBarAciklama
    {
        public myRibbonControl()
        {
            ShowSearchItem = false;
            ShowApplicationButton = DefaultBoolean.False;
            ShowDisplayOptionsMenuButton = DefaultBoolean.False;
            ShowExpandCollapseButton = DefaultBoolean.False;
            ShowItemCaptionsInCaptionBar = false;
            ShowItemCaptionsInPageHeader = false;
            ShowItemCaptionsInQAT = false;
            ShowMoreCommandsButton = DefaultBoolean.False;
            ShowQatLocationSelector = false;
            ShowToolbarCustomizeItem = false;
            ToolbarLocation = RibbonQuickAccessToolbarLocation.Hidden;
            ShowPageHeadersInFormCaption = DefaultBoolean.False;
            ShowPageHeadersMode = ShowPageHeadersMode.Hide;
        }
        public string StatusBarAciklama { get; set; }
    }
}

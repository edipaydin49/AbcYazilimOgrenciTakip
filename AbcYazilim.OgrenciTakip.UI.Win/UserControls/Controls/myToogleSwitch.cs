using DevExpress.XtraEditors;
using DevExpress.Utils;
using System.Drawing;
using System.ComponentModel;
using AbcYazilim.OgrenciTakip.UI.Win.Interfaces;

namespace AbcYazilim.OgrenciTakip.UI.Win.UserControls.Controls
{
    [ToolboxItem(true)]
   public class myToogleSwitch:ToggleSwitch,IStatusBarAciklama
    {
        public myToogleSwitch()
        {
            Name = "tglDurum";
            Properties.OffText = "Pasif";
            Properties.OnText = "Aktif";
            Properties.AutoHeight = false;
            Properties.AutoWidth = true;
            Properties.GlyphAlignment = HorzAlignment.Far;
            Properties.Appearance.ForeColor = Color.Maroon;
        }
        public override bool EnterMoveNextControl { get; set; } = true;
        public string StatusBarAciklama { get ; set ; }
    }
}

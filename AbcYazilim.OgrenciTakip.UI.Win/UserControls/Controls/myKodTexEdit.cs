using System.ComponentModel;
using System.Drawing;
using AbcYazilim.OgrenciTakip.UI.Win.Interfaces;
using DevExpress.Utils;

namespace AbcYazilim.OgrenciTakip.UI.Win.UserControls.Controls
{
    [ToolboxItem(true)]
    public class myKodTexEdit : myTextEdit, IStatusBarAciklama
    {
        public myKodTexEdit()
        {
            Properties.Appearance.BackColor = Color.PaleGoldenrod;
            Properties.Appearance.TextOptions.HAlignment = HorzAlignment.Center;
            Properties.MaxLength = 20;
            StatusBarAciklama = "Kod Giriniz";
        }
        public override bool EnterMoveNextControl { get; set; } = true;  
    }
}

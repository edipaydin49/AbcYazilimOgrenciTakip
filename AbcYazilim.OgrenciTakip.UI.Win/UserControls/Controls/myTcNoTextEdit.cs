using System.ComponentModel;
using AbcYazilim.OgrenciTakip.UI.Win.Interfaces;
using DevExpress.Utils;
using DevExpress.XtraEditors.Mask;

namespace AbcYazilim.OgrenciTakip.UI.Win.UserControls.Controls
{   [ToolboxItem(true)]
   public class myTcNoTextEdit:myTextEdit
    {
        public myTcNoTextEdit()
        {
            Properties.Appearance.TextOptions.HAlignment = HorzAlignment.Center;
            Properties.Mask.MaskType = MaskType.Regular;
            Properties.Mask.EditMask = @"\d?\d?\d?\d?\d?\d?\d?\d?\d?\d?\d?";
            Properties.Mask.AutoComplete = AutoCompleteType.None;
            StatusBarAciklama = "Tc Kimlik  No Giriniz";
        }
    }
}

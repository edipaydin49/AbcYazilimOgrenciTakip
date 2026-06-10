using System.ComponentModel;
using AbcYazilim.OgrenciTakip.UI.Win.Interfaces;
using DevExpress.XtraEditors.Mask;

namespace AbcYazilim.OgrenciTakip.UI.Win.UserControls.Controls
{
    [ToolboxItem(true)]
   public class myIbanTextEdit:myTextEdit, IStatusBarAciklama
    {
        public myIbanTextEdit()
        {
            Properties.Mask.MaskType = MaskType.Regular;
            Properties.Mask.EditMask = @"TR\d?\d? \d?\d?\d?\d? \d?\d?\d?\d? \d?\d?\d?\d? \d?\d?\d?\d? \d?\d?\d?\d? \d?\d?";
            Properties.Mask.AutoComplete = AutoCompleteType.None;
            StatusBarAciklama = "Iban No Giriniz";
        }
        public override bool EnterMoveNextControl { get; set; } = true;

    }
}

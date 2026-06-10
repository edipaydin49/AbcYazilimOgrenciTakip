using System.ComponentModel;
using DevExpress.XtraEditors;
using System.Drawing;
using AbcYazilim.OgrenciTakip.UI.Win.Interfaces;
using System;

namespace AbcYazilim.OgrenciTakip.UI.Win.UserControls.Controls
{
    [ToolboxItem(true)]
   public class mySimpleButton:SimpleButton, IStatusBarAciklama
    {
        public mySimpleButton()
        {
            Appearance.ForeColor = Color.Maroon;
        }
  
        public string StatusBarAciklama { get; set; }
    }
}

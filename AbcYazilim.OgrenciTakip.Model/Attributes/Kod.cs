using System;

namespace AbcYazilim.OgrenciTakip.Model.Attributes
{

    public class Kod : Attribute
    {
        public string Description { get; }
        public string ControlName { get; }
        /// <summary>
        /// Validation İşlemleri Sırasında İçin Zorunlu Olan Alanları İçin Kullanılacak
        /// </summary>
        /// <param name="description"> Uyarı Mesajında Gösterilecek Olan Açıklama</param>
        /// <param name="controlName"> Uyarı Sonrası Focuslanacak Control Adı</param>
        /// 
        public Kod(string description, string controlName)
        {
            Description = description;
            ControlName = controlName;
        }

    }
}

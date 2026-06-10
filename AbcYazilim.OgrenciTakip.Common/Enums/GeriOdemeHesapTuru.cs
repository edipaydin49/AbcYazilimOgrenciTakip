using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AbcYazilim.OgrenciTakip.Common.Enums
{
    public enum GeriOdemeHesapTuru : byte
    {
        [Description("Banka")]
        Banka = 1,
        [Description("Kasa")]
        Kasa = 2
    }
}

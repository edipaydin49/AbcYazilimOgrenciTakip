using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AbcYazilim.OgrenciTakip.Common.Enums
{
    public enum EposKartTuru : byte
    {
        [Description("Visa Kart")]
        Visa = 1,
        [Description("Master KArt")]
        Master = 2,
        [Description("American Express Kart")]
        AmericanExpress = 3
    }
}
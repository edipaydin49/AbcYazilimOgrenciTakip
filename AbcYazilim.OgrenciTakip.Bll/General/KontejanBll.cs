using AbcYazilim.OgrenciTakip.Bll.Base;
using AbcYazilim.OgrenciTakip.Bll.Interfaces;
using AbcYazilim.OgrenciTakip.Common.Enums;
using AbcYazilim.OgrenciTakip.Model.Entities;
using System.Windows.Forms;

namespace AbcYazilim.OgrenciTakip.Bll.General
{
    public class KontejanBll : BaseGenelBll<Kontejan>, IBaseGenelBll, IBaseCommonBll
    {
        public KontejanBll() : base(KartTuru.Kontejan) { }
        public KontejanBll(Control ctrl) : base(ctrl, KartTuru.Kontejan) { }
    }
}

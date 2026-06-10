using AbcYazilim.OgrenciTakip.Common.Enums;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace AbcYazilim.Dal.Interfaces
{
    /// *<T> sadece değer olması için yazılması için sadece yazılmış
    public interface IRepository<T> : IDisposable where T : class
    {
        void Insert(T entity);
        void Insert(IEnumerable<T> entities);
        void Update(T entity);
        void Update(T entity, IEnumerable<string> fields);
        void Update(IEnumerable<T> entities);
        void Delete(T entity);
        void Delete(IEnumerable<T> entities);

        //*T türünde sorgu gönderilecek true yada false olarak geri döndür
        TResult Find<TResult>(Expression<Func<T, bool>> filter, Expression<Func<T, TResult>> selector);

        //*T türünü barındıran filtre gönderecek kayıt varsa değer döndürür(strin olarak döndürüs DATALİST vs ile içi dolar)
        IQueryable<TResult> Select<TResult>(Expression<Func<T, bool>> filter, Expression<Func<T, TResult>> slector);


        int Count(Expression<Func<T, bool>> filter = null);
        //Yeni Kod Üretimi için gerekli parametreler kartTuru hangi karta ait kod oluşturlacağı filter rakamsal değer taraması sonrası en yükseği bulacak
        string YeniKodVer(KartTuru kartTuru, Expression<Func<T, string>> filter, Expression<Func<T, bool>> where = null);
    }
}

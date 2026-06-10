using System.Data.Entity;
using System.Data.Entity.Migrations;

namespace AbcYazilim.OgrenciTakip.Data.Contexts
{
    public class BaseDbContext<TContext, TConfiguration> : DbContext where TContext : DbContext where TConfiguration : DbMigrationsConfiguration<TContext>, new()
    {
        //Connectionstrig adını oluşturuyoruz..typeof(TContext).Name ismini öğrenip _nameOrConnectionString a atama yaptırıyoruz
        private static string _nameOrConnectionString = typeof(TContext).Name;
        public BaseDbContext() : base(_nameOrConnectionString) { }
        public BaseDbContext(string connectionString) : base(connectionString)
        {
            ///Database bağlantıyı yapacak tabloları karşılaştırma yapacak ve değişiklikleri güncelleyecek
            Database.SetInitializer(new MigrateDatabaseToLatestVersion<TContext, TConfiguration>());
            _nameOrConnectionString = connectionString;
        }
    }
}

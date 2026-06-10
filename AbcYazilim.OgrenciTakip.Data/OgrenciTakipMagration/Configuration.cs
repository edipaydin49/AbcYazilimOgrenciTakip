using AbcYazilim.OgrenciTakip.Data.Contexts;
using System.Data.Entity.Migrations;

namespace AbcYazilim.OgrenciTakip.Data.OgrenciTakipMagration
{
    public class Configuration : DbMigrationsConfiguration<OgrenciTakipContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
            AutomaticMigrationDataLossAllowed = true;
        }
    }
}

namespace AbcYazilim.OgrenciTakip.UI.Win.UserControls.UserControl.TahakkukEditFormTable
{
    partial class HizmetBilgileriTable
    {
        /// <summary> 
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary> 
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Component Designer generated code

        /// <summary> 
        /// Required method for Designer support - do not modify 
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            DevExpress.XtraGrid.GridFormatRule gridFormatRule1 = new DevExpress.XtraGrid.GridFormatRule();
            DevExpress.XtraEditors.FormatConditionRuleValue formatConditionRuleValue1 = new DevExpress.XtraEditors.FormatConditionRuleValue();
            this.grid = new AbcYazilim.OgrenciTakip.UI.Win.UserControls.Controls.Grid.myGridControl();
            this.tablo = new AbcYazilim.OgrenciTakip.UI.Win.UserControls.Controls.Grid.MyGridView();
            this.colHizmetId = new AbcYazilim.OgrenciTakip.UI.Win.UserControls.Controls.Grid.MyGridColumn();
            this.colHizmetAdi = new AbcYazilim.OgrenciTakip.UI.Win.UserControls.Controls.Grid.MyGridColumn();
            this.colHizmetTuruId = new AbcYazilim.OgrenciTakip.UI.Win.UserControls.Controls.Grid.MyGridColumn();
            this.colServisId = new AbcYazilim.OgrenciTakip.UI.Win.UserControls.Controls.Grid.MyGridColumn();
            this.colServisYeriAdi = new AbcYazilim.OgrenciTakip.UI.Win.UserControls.Controls.Grid.MyGridColumn();
            this.colIslemTarihi = new AbcYazilim.OgrenciTakip.UI.Win.UserControls.Controls.Grid.MyGridColumn();
            this.repositoryTarih = new DevExpress.XtraEditors.Repository.RepositoryItemDateEdit();
            this.colBaslamaTarihi = new AbcYazilim.OgrenciTakip.UI.Win.UserControls.Controls.Grid.MyGridColumn();
            this.colBrutUcret = new AbcYazilim.OgrenciTakip.UI.Win.UserControls.Controls.Grid.MyGridColumn();
            this.repositoryIDecimal = new DevExpress.XtraEditors.Repository.RepositoryItemCalcEdit();
            this.colKistDonemDusulenUcret = new AbcYazilim.OgrenciTakip.UI.Win.UserControls.Controls.Grid.MyGridColumn();
            this.colNetUcret = new AbcYazilim.OgrenciTakip.UI.Win.UserControls.Controls.Grid.MyGridColumn();
            this.colIptalEdildi = new AbcYazilim.OgrenciTakip.UI.Win.UserControls.Controls.Grid.MyGridColumn();
            this.colEgitimDonemiGunSayisi = new AbcYazilim.OgrenciTakip.UI.Win.UserControls.Controls.Grid.MyGridColumn();
            this.colAlinanHizmetGunSayisi = new AbcYazilim.OgrenciTakip.UI.Win.UserControls.Controls.Grid.MyGridColumn();
            this.colGunlukUcret = new AbcYazilim.OgrenciTakip.UI.Win.UserControls.Controls.Grid.MyGridColumn();
            this.colIptalTarihi = new AbcYazilim.OgrenciTakip.UI.Win.UserControls.Controls.Grid.MyGridColumn();
            this.repositoryIptalTarihi = new DevExpress.XtraEditors.Repository.RepositoryItemDateEdit();
            this.colIptalNedeniId = new AbcYazilim.OgrenciTakip.UI.Win.UserControls.Controls.Grid.MyGridColumn();
            this.colIptalNedeniAdi = new AbcYazilim.OgrenciTakip.UI.Win.UserControls.Controls.Grid.MyGridColumn();
            this.repositoryIptalNedeni = new DevExpress.XtraEditors.Repository.RepositoryItemButtonEdit();
            this.colGittigiOkulId = new AbcYazilim.OgrenciTakip.UI.Win.UserControls.Controls.Grid.MyGridColumn();
            this.colGittigiOkulAdi = new AbcYazilim.OgrenciTakip.UI.Win.UserControls.Controls.Grid.MyGridColumn();
            this.repositoryGittigiOkul = new DevExpress.XtraEditors.Repository.RepositoryItemButtonEdit();
            this.colIptalAciklama = new AbcYazilim.OgrenciTakip.UI.Win.UserControls.Controls.Grid.MyGridColumn();
            ((System.ComponentModel.ISupportInitialize)(this.grid)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.tablo)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.repositoryTarih)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.repositoryTarih.CalendarTimeProperties)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.repositoryIDecimal)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.repositoryIptalTarihi)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.repositoryIptalTarihi.CalendarTimeProperties)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.repositoryIptalNedeni)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.repositoryGittigiOkul)).BeginInit();
            this.SuspendLayout();
            // 
            // insUpNavigator
            // 
            this.insUpNavigator.Location = new System.Drawing.Point(0, 221);
            this.insUpNavigator.Size = new System.Drawing.Size(945, 24);
            // 
            // grid
            // 
            this.grid.Dock = System.Windows.Forms.DockStyle.Fill;
            this.grid.Location = new System.Drawing.Point(0, 0);
            this.grid.MainView = this.tablo;
            this.grid.Name = "grid";
            this.grid.RepositoryItems.AddRange(new DevExpress.XtraEditors.Repository.RepositoryItem[] {
            this.repositoryTarih,
            this.repositoryIDecimal,
            this.repositoryIptalNedeni,
            this.repositoryGittigiOkul,
            this.repositoryIptalTarihi});
            this.grid.Size = new System.Drawing.Size(945, 221);
            this.grid.TabIndex = 5;
            this.grid.ViewCollection.AddRange(new DevExpress.XtraGrid.Views.Base.BaseView[] {
            this.tablo});
            // 
            // tablo
            // 
            this.tablo.Appearance.FooterPanel.Font = new System.Drawing.Font("Tahoma", 8.25F, System.Drawing.FontStyle.Bold);
            this.tablo.Appearance.FooterPanel.ForeColor = System.Drawing.Color.Maroon;
            this.tablo.Appearance.FooterPanel.Options.UseFont = true;
            this.tablo.Appearance.FooterPanel.Options.UseForeColor = true;
            this.tablo.Appearance.HeaderPanel.ForeColor = System.Drawing.Color.Maroon;
            this.tablo.Appearance.HeaderPanel.Options.UseForeColor = true;
            this.tablo.Appearance.HeaderPanel.Options.UseTextOptions = true;
            this.tablo.Appearance.HeaderPanel.TextOptions.HAlignment = DevExpress.Utils.HorzAlignment.Center;
            this.tablo.Appearance.ViewCaption.ForeColor = System.Drawing.Color.Maroon;
            this.tablo.Appearance.ViewCaption.Options.UseForeColor = true;
            this.tablo.Columns.AddRange(new DevExpress.XtraGrid.Columns.GridColumn[] {
            this.colHizmetId,
            this.colHizmetAdi,
            this.colHizmetTuruId,
            this.colServisId,
            this.colServisYeriAdi,
            this.colIslemTarihi,
            this.colBaslamaTarihi,
            this.colBrutUcret,
            this.colKistDonemDusulenUcret,
            this.colNetUcret,
            this.colIptalEdildi,
            this.colEgitimDonemiGunSayisi,
            this.colAlinanHizmetGunSayisi,
            this.colGunlukUcret,
            this.colIptalTarihi,
            this.colIptalNedeniId,
            this.colIptalNedeniAdi,
            this.colGittigiOkulId,
            this.colGittigiOkulAdi,
            this.colIptalAciklama});
            gridFormatRule1.ApplyToRow = true;
            gridFormatRule1.Column = this.colIptalEdildi;
            gridFormatRule1.Name = "Format0";
            formatConditionRuleValue1.Appearance.BackColor = System.Drawing.Color.MistyRose;
            formatConditionRuleValue1.Appearance.FontStyleDelta = System.Drawing.FontStyle.Italic;
            formatConditionRuleValue1.Appearance.ForeColor = System.Drawing.Color.Red;
            formatConditionRuleValue1.Appearance.Options.HighPriority = true;
            formatConditionRuleValue1.Appearance.Options.UseBackColor = true;
            formatConditionRuleValue1.Appearance.Options.UseFont = true;
            formatConditionRuleValue1.Appearance.Options.UseForeColor = true;
            formatConditionRuleValue1.Condition = DevExpress.XtraEditors.FormatCondition.Equal;
            formatConditionRuleValue1.Value1 = true;
            gridFormatRule1.Rule = formatConditionRuleValue1;
            this.tablo.FormatRules.Add(gridFormatRule1);
            this.tablo.GridControl = this.grid;
            this.tablo.Name = "tablo";
            this.tablo.OptionsMenu.EnableColumnMenu = false;
            this.tablo.OptionsMenu.EnableFooterMenu = false;
            this.tablo.OptionsMenu.EnableGroupPanelMenu = false;
            this.tablo.OptionsNavigation.EnterMoveNextColumn = true;
            this.tablo.OptionsPrint.AutoWidth = false;
            this.tablo.OptionsPrint.PrintFooter = false;
            this.tablo.OptionsPrint.PrintGroupFooter = false;
            this.tablo.OptionsView.ColumnAutoWidth = false;
            this.tablo.OptionsView.ColumnHeaderAutoHeight = DevExpress.Utils.DefaultBoolean.True;
            this.tablo.OptionsView.HeaderFilterButtonShowMode = DevExpress.XtraEditors.Controls.FilterButtonShowMode.Button;
            this.tablo.OptionsView.RowAutoHeight = true;
            this.tablo.OptionsView.ShowFooter = true;
            this.tablo.OptionsView.ShowGroupPanel = false;
            this.tablo.OptionsView.ShowViewCaption = true;
            this.tablo.SortInfo.AddRange(new DevExpress.XtraGrid.Columns.GridColumnSortInfo[] {
            new DevExpress.XtraGrid.Columns.GridColumnSortInfo(this.colIptalAciklama, DevExpress.Data.ColumnSortOrder.Ascending)});
            this.tablo.StatusBarAciklama = "Öğrenciye Verilen Hizmetleri Seçiniz.";
            this.tablo.StatusBarKisaYol = "Shift+Insert :";
            this.tablo.StatusBarKisaYolAciklama = "Seçim Yap";
            this.tablo.ViewCaption = "Hizmet Bilgileri";
            // 
            // colHizmetId
            // 
            this.colHizmetId.Caption = "HizmetId";
            this.colHizmetId.FieldName = "HizmetId";
            this.colHizmetId.Name = "colHizmetId";
            this.colHizmetId.OptionsColumn.AllowEdit = false;
            this.colHizmetId.OptionsColumn.ShowInCustomizationForm = false;
            this.colHizmetId.StatusBarAciklama = null;
            this.colHizmetId.StatusBarKisaYol = null;
            this.colHizmetId.StatusBarKisaYolAciklama = null;
            // 
            // colHizmetAdi
            // 
            this.colHizmetAdi.Caption = "Hizmet Adı";
            this.colHizmetAdi.FieldName = "HizmetAdi";
            this.colHizmetAdi.Name = "colHizmetAdi";
            this.colHizmetAdi.OptionsColumn.AllowEdit = false;
            this.colHizmetAdi.OptionsColumn.AllowMove = false;
            this.colHizmetAdi.OptionsColumn.AllowShowHide = false;
            this.colHizmetAdi.OptionsColumn.AllowSort = DevExpress.Utils.DefaultBoolean.True;
            this.colHizmetAdi.OptionsFilter.AllowAutoFilter = false;
            this.colHizmetAdi.OptionsFilter.AllowFilter = false;
            this.colHizmetAdi.StatusBarAciklama = null;
            this.colHizmetAdi.StatusBarKisaYol = null;
            this.colHizmetAdi.StatusBarKisaYolAciklama = null;
            this.colHizmetAdi.Visible = true;
            this.colHizmetAdi.VisibleIndex = 0;
            this.colHizmetAdi.Width = 200;
            // 
            // colHizmetTuruId
            // 
            this.colHizmetTuruId.Caption = "Hizmet Turu Id";
            this.colHizmetTuruId.FieldName = "HizmetTuruId";
            this.colHizmetTuruId.Name = "colHizmetTuruId";
            this.colHizmetTuruId.OptionsColumn.AllowEdit = false;
            this.colHizmetTuruId.OptionsColumn.ShowInCustomizationForm = false;
            this.colHizmetTuruId.StatusBarAciklama = null;
            this.colHizmetTuruId.StatusBarKisaYol = null;
            this.colHizmetTuruId.StatusBarKisaYolAciklama = null;
            // 
            // colServisId
            // 
            this.colServisId.Caption = "ServisId";
            this.colServisId.FieldName = "ServisId";
            this.colServisId.Name = "colServisId";
            this.colServisId.OptionsColumn.AllowEdit = false;
            this.colServisId.OptionsColumn.ShowInCustomizationForm = false;
            this.colServisId.StatusBarAciklama = null;
            this.colServisId.StatusBarKisaYol = null;
            this.colServisId.StatusBarKisaYolAciklama = null;
            // 
            // colServisYeriAdi
            // 
            this.colServisYeriAdi.Caption = "Servis Yeri";
            this.colServisYeriAdi.FieldName = "ServisYeriAdi";
            this.colServisYeriAdi.Name = "colServisYeriAdi";
            this.colServisYeriAdi.OptionsColumn.AllowEdit = false;
            this.colServisYeriAdi.OptionsColumn.AllowMove = false;
            this.colServisYeriAdi.OptionsColumn.AllowShowHide = false;
            this.colServisYeriAdi.OptionsColumn.AllowSort = DevExpress.Utils.DefaultBoolean.True;
            this.colServisYeriAdi.OptionsFilter.AllowAutoFilter = false;
            this.colServisYeriAdi.OptionsFilter.AllowFilter = false;
            this.colServisYeriAdi.StatusBarAciklama = null;
            this.colServisYeriAdi.StatusBarKisaYol = null;
            this.colServisYeriAdi.StatusBarKisaYolAciklama = null;
            this.colServisYeriAdi.Width = 102;
            // 
            // colIslemTarihi
            // 
            this.colIslemTarihi.AppearanceCell.Options.UseTextOptions = true;
            this.colIslemTarihi.AppearanceCell.TextOptions.HAlignment = DevExpress.Utils.HorzAlignment.Center;
            this.colIslemTarihi.Caption = "İşlem Tarihi";
            this.colIslemTarihi.ColumnEdit = this.repositoryTarih;
            this.colIslemTarihi.FieldName = "IslemTarihi";
            this.colIslemTarihi.Name = "colIslemTarihi";
            this.colIslemTarihi.OptionsColumn.AllowEdit = false;
            this.colIslemTarihi.OptionsColumn.AllowMove = false;
            this.colIslemTarihi.OptionsColumn.AllowShowHide = false;
            this.colIslemTarihi.OptionsColumn.AllowSort = DevExpress.Utils.DefaultBoolean.True;
            this.colIslemTarihi.OptionsFilter.AllowAutoFilter = false;
            this.colIslemTarihi.OptionsFilter.AllowFilter = false;
            this.colIslemTarihi.StatusBarAciklama = null;
            this.colIslemTarihi.StatusBarKisaYol = null;
            this.colIslemTarihi.StatusBarKisaYolAciklama = null;
            this.colIslemTarihi.Visible = true;
            this.colIslemTarihi.VisibleIndex = 5;
            this.colIslemTarihi.Width = 100;
            // 
            // repositoryTarih
            // 
            this.repositoryTarih.AutoHeight = false;
            this.repositoryTarih.Buttons.AddRange(new DevExpress.XtraEditors.Controls.EditorButton[] {
            new DevExpress.XtraEditors.Controls.EditorButton(DevExpress.XtraEditors.Controls.ButtonPredefines.Combo)});
            this.repositoryTarih.CalendarTimeProperties.Buttons.AddRange(new DevExpress.XtraEditors.Controls.EditorButton[] {
            new DevExpress.XtraEditors.Controls.EditorButton(DevExpress.XtraEditors.Controls.ButtonPredefines.Combo)});
            this.repositoryTarih.Mask.MaskType = DevExpress.XtraEditors.Mask.MaskType.DateTimeAdvancingCaret;
            this.repositoryTarih.Name = "repositoryTarih";
            // 
            // colBaslamaTarihi
            // 
            this.colBaslamaTarihi.AppearanceCell.Options.UseTextOptions = true;
            this.colBaslamaTarihi.AppearanceCell.TextOptions.HAlignment = DevExpress.Utils.HorzAlignment.Center;
            this.colBaslamaTarihi.Caption = "Başalama Tarihi";
            this.colBaslamaTarihi.ColumnEdit = this.repositoryTarih;
            this.colBaslamaTarihi.FieldName = "BaslamaTarihi";
            this.colBaslamaTarihi.Name = "colBaslamaTarihi";
            this.colBaslamaTarihi.OptionsColumn.AllowEdit = false;
            this.colBaslamaTarihi.OptionsColumn.AllowMove = false;
            this.colBaslamaTarihi.OptionsColumn.AllowShowHide = false;
            this.colBaslamaTarihi.OptionsColumn.AllowSort = DevExpress.Utils.DefaultBoolean.True;
            this.colBaslamaTarihi.OptionsFilter.AllowAutoFilter = false;
            this.colBaslamaTarihi.OptionsFilter.AllowFilter = false;
            this.colBaslamaTarihi.StatusBarAciklama = null;
            this.colBaslamaTarihi.StatusBarKisaYol = null;
            this.colBaslamaTarihi.StatusBarKisaYolAciklama = null;
            this.colBaslamaTarihi.Visible = true;
            this.colBaslamaTarihi.VisibleIndex = 1;
            this.colBaslamaTarihi.Width = 100;
            // 
            // colBrutUcret
            // 
            this.colBrutUcret.Caption = "Brüt Ücret";
            this.colBrutUcret.ColumnEdit = this.repositoryIDecimal;
            this.colBrutUcret.FieldName = "BrutUcret";
            this.colBrutUcret.Name = "colBrutUcret";
            this.colBrutUcret.OptionsColumn.AllowEdit = false;
            this.colBrutUcret.OptionsColumn.AllowMove = false;
            this.colBrutUcret.OptionsColumn.AllowShowHide = false;
            this.colBrutUcret.OptionsColumn.AllowSort = DevExpress.Utils.DefaultBoolean.True;
            this.colBrutUcret.OptionsFilter.AllowAutoFilter = false;
            this.colBrutUcret.OptionsFilter.AllowFilter = false;
            this.colBrutUcret.StatusBarAciklama = null;
            this.colBrutUcret.StatusBarKisaYol = null;
            this.colBrutUcret.StatusBarKisaYolAciklama = null;
            this.colBrutUcret.Summary.AddRange(new DevExpress.XtraGrid.GridSummaryItem[] {
            new DevExpress.XtraGrid.GridColumnSummaryItem(DevExpress.Data.SummaryItemType.Sum, "BrutUcret", "{0:n2}")});
            this.colBrutUcret.Visible = true;
            this.colBrutUcret.VisibleIndex = 2;
            this.colBrutUcret.Width = 100;
            // 
            // repositoryIDecimal
            // 
            this.repositoryIDecimal.AutoHeight = false;
            this.repositoryIDecimal.Buttons.AddRange(new DevExpress.XtraEditors.Controls.EditorButton[] {
            new DevExpress.XtraEditors.Controls.EditorButton(DevExpress.XtraEditors.Controls.ButtonPredefines.Combo)});
            this.repositoryIDecimal.DisplayFormat.FormatString = "{0:n2}";
            this.repositoryIDecimal.DisplayFormat.FormatType = DevExpress.Utils.FormatType.Numeric;
            this.repositoryIDecimal.EditFormat.FormatString = "{0:n2}";
            this.repositoryIDecimal.EditFormat.FormatType = DevExpress.Utils.FormatType.Numeric;
            this.repositoryIDecimal.MaskSettings.Set("mask", "n2");
            this.repositoryIDecimal.Name = "repositoryIDecimal";
            // 
            // colKistDonemDusulenUcret
            // 
            this.colKistDonemDusulenUcret.Caption = "Kıst. Dönem Düşülen Ücret";
            this.colKistDonemDusulenUcret.ColumnEdit = this.repositoryIDecimal;
            this.colKistDonemDusulenUcret.FieldName = "KistDonemDusulenUcret";
            this.colKistDonemDusulenUcret.Name = "colKistDonemDusulenUcret";
            this.colKistDonemDusulenUcret.OptionsColumn.AllowEdit = false;
            this.colKistDonemDusulenUcret.OptionsColumn.AllowMove = false;
            this.colKistDonemDusulenUcret.OptionsColumn.AllowShowHide = false;
            this.colKistDonemDusulenUcret.OptionsColumn.AllowSort = DevExpress.Utils.DefaultBoolean.True;
            this.colKistDonemDusulenUcret.OptionsFilter.AllowAutoFilter = false;
            this.colKistDonemDusulenUcret.OptionsFilter.AllowFilter = false;
            this.colKistDonemDusulenUcret.StatusBarAciklama = null;
            this.colKistDonemDusulenUcret.StatusBarKisaYol = null;
            this.colKistDonemDusulenUcret.StatusBarKisaYolAciklama = null;
            this.colKistDonemDusulenUcret.Summary.AddRange(new DevExpress.XtraGrid.GridSummaryItem[] {
            new DevExpress.XtraGrid.GridColumnSummaryItem(DevExpress.Data.SummaryItemType.Sum, "KistDonemDusulenUcret", "{0:n2}")});
            this.colKistDonemDusulenUcret.Visible = true;
            this.colKistDonemDusulenUcret.VisibleIndex = 3;
            this.colKistDonemDusulenUcret.Width = 100;
            // 
            // colNetUcret
            // 
            this.colNetUcret.Caption = "Net Ücret";
            this.colNetUcret.ColumnEdit = this.repositoryIDecimal;
            this.colNetUcret.FieldName = "NetUcret";
            this.colNetUcret.Name = "colNetUcret";
            this.colNetUcret.OptionsColumn.AllowEdit = false;
            this.colNetUcret.OptionsColumn.AllowMove = false;
            this.colNetUcret.OptionsColumn.AllowShowHide = false;
            this.colNetUcret.OptionsColumn.AllowSort = DevExpress.Utils.DefaultBoolean.True;
            this.colNetUcret.OptionsFilter.AllowAutoFilter = false;
            this.colNetUcret.OptionsFilter.AllowFilter = false;
            this.colNetUcret.StatusBarAciklama = null;
            this.colNetUcret.StatusBarKisaYol = null;
            this.colNetUcret.StatusBarKisaYolAciklama = null;
            this.colNetUcret.Summary.AddRange(new DevExpress.XtraGrid.GridSummaryItem[] {
            new DevExpress.XtraGrid.GridColumnSummaryItem(DevExpress.Data.SummaryItemType.Sum, "NetUcret", "{0:n2}")});
            this.colNetUcret.Visible = true;
            this.colNetUcret.VisibleIndex = 4;
            this.colNetUcret.Width = 100;
            // 
            // colIptalEdildi
            // 
            this.colIptalEdildi.Caption = "İptal Edildi";
            this.colIptalEdildi.FieldName = "IptalEdildi";
            this.colIptalEdildi.Name = "colIptalEdildi";
            this.colIptalEdildi.OptionsColumn.AllowEdit = false;
            this.colIptalEdildi.OptionsColumn.ShowInCustomizationForm = false;
            this.colIptalEdildi.StatusBarAciklama = null;
            this.colIptalEdildi.StatusBarKisaYol = null;
            this.colIptalEdildi.StatusBarKisaYolAciklama = null;
            // 
            // colEgitimDonemiGunSayisi
            // 
            this.colEgitimDonemiGunSayisi.AppearanceCell.Options.UseTextOptions = true;
            this.colEgitimDonemiGunSayisi.AppearanceCell.TextOptions.HAlignment = DevExpress.Utils.HorzAlignment.Center;
            this.colEgitimDonemiGunSayisi.Caption = "Eğitim Dönemi Gün Sayısı";
            this.colEgitimDonemiGunSayisi.FieldName = "EgitimDonemiGunSayisi";
            this.colEgitimDonemiGunSayisi.Name = "colEgitimDonemiGunSayisi";
            this.colEgitimDonemiGunSayisi.OptionsColumn.AllowEdit = false;
            this.colEgitimDonemiGunSayisi.OptionsColumn.AllowMove = false;
            this.colEgitimDonemiGunSayisi.OptionsColumn.AllowShowHide = false;
            this.colEgitimDonemiGunSayisi.OptionsColumn.AllowSort = DevExpress.Utils.DefaultBoolean.True;
            this.colEgitimDonemiGunSayisi.OptionsFilter.AllowAutoFilter = false;
            this.colEgitimDonemiGunSayisi.OptionsFilter.AllowFilter = false;
            this.colEgitimDonemiGunSayisi.StatusBarAciklama = null;
            this.colEgitimDonemiGunSayisi.StatusBarKisaYol = null;
            this.colEgitimDonemiGunSayisi.StatusBarKisaYolAciklama = null;
            this.colEgitimDonemiGunSayisi.Visible = true;
            this.colEgitimDonemiGunSayisi.VisibleIndex = 6;
            this.colEgitimDonemiGunSayisi.Width = 100;
            // 
            // colAlinanHizmetGunSayisi
            // 
            this.colAlinanHizmetGunSayisi.AppearanceCell.Options.UseTextOptions = true;
            this.colAlinanHizmetGunSayisi.AppearanceCell.TextOptions.HAlignment = DevExpress.Utils.HorzAlignment.Center;
            this.colAlinanHizmetGunSayisi.Caption = "Alinan Hizmet Gün Sayisi";
            this.colAlinanHizmetGunSayisi.FieldName = "AlinanHizmetGunSayisi";
            this.colAlinanHizmetGunSayisi.Name = "colAlinanHizmetGunSayisi";
            this.colAlinanHizmetGunSayisi.OptionsColumn.AllowEdit = false;
            this.colAlinanHizmetGunSayisi.OptionsColumn.AllowMove = false;
            this.colAlinanHizmetGunSayisi.OptionsColumn.AllowShowHide = false;
            this.colAlinanHizmetGunSayisi.OptionsColumn.AllowSort = DevExpress.Utils.DefaultBoolean.True;
            this.colAlinanHizmetGunSayisi.OptionsFilter.AllowAutoFilter = false;
            this.colAlinanHizmetGunSayisi.OptionsFilter.AllowFilter = false;
            this.colAlinanHizmetGunSayisi.StatusBarAciklama = null;
            this.colAlinanHizmetGunSayisi.StatusBarKisaYol = null;
            this.colAlinanHizmetGunSayisi.StatusBarKisaYolAciklama = null;
            this.colAlinanHizmetGunSayisi.Visible = true;
            this.colAlinanHizmetGunSayisi.VisibleIndex = 7;
            this.colAlinanHizmetGunSayisi.Width = 100;
            // 
            // colGunlukUcret
            // 
            this.colGunlukUcret.Caption = "Günlük Ücret";
            this.colGunlukUcret.ColumnEdit = this.repositoryIDecimal;
            this.colGunlukUcret.FieldName = "GunlukUcret";
            this.colGunlukUcret.Name = "colGunlukUcret";
            this.colGunlukUcret.OptionsColumn.AllowEdit = false;
            this.colGunlukUcret.OptionsColumn.AllowMove = false;
            this.colGunlukUcret.OptionsColumn.AllowShowHide = false;
            this.colGunlukUcret.OptionsColumn.AllowSort = DevExpress.Utils.DefaultBoolean.True;
            this.colGunlukUcret.OptionsFilter.AllowAutoFilter = false;
            this.colGunlukUcret.OptionsFilter.AllowFilter = false;
            this.colGunlukUcret.StatusBarAciklama = null;
            this.colGunlukUcret.StatusBarKisaYol = null;
            this.colGunlukUcret.StatusBarKisaYolAciklama = null;
            this.colGunlukUcret.Visible = true;
            this.colGunlukUcret.VisibleIndex = 8;
            this.colGunlukUcret.Width = 100;
            // 
            // colIptalTarihi
            // 
            this.colIptalTarihi.AppearanceCell.Options.UseTextOptions = true;
            this.colIptalTarihi.AppearanceCell.TextOptions.HAlignment = DevExpress.Utils.HorzAlignment.Center;
            this.colIptalTarihi.Caption = "İptal Tarihi";
            this.colIptalTarihi.ColumnEdit = this.repositoryIptalTarihi;
            this.colIptalTarihi.FieldName = "IptalTarihi";
            this.colIptalTarihi.Name = "colIptalTarihi";
            this.colIptalTarihi.OptionsColumn.AllowEdit = false;
            this.colIptalTarihi.OptionsColumn.AllowMove = false;
            this.colIptalTarihi.OptionsColumn.AllowShowHide = false;
            this.colIptalTarihi.OptionsColumn.AllowSort = DevExpress.Utils.DefaultBoolean.True;
            this.colIptalTarihi.OptionsFilter.AllowAutoFilter = false;
            this.colIptalTarihi.OptionsFilter.AllowFilter = false;
            this.colIptalTarihi.StatusBarAciklama = "Tarih Seçiniz";
            this.colIptalTarihi.StatusBarKisaYol = "F4 :";
            this.colIptalTarihi.StatusBarKisaYolAciklama = "Seçim Yap";
            this.colIptalTarihi.Visible = true;
            this.colIptalTarihi.VisibleIndex = 9;
            this.colIptalTarihi.Width = 99;
            // 
            // repositoryIptalTarihi
            // 
            this.repositoryIptalTarihi.AutoHeight = false;
            this.repositoryIptalTarihi.Buttons.AddRange(new DevExpress.XtraEditors.Controls.EditorButton[] {
            new DevExpress.XtraEditors.Controls.EditorButton(DevExpress.XtraEditors.Controls.ButtonPredefines.Combo)});
            this.repositoryIptalTarihi.CalendarTimeProperties.Buttons.AddRange(new DevExpress.XtraEditors.Controls.EditorButton[] {
            new DevExpress.XtraEditors.Controls.EditorButton(DevExpress.XtraEditors.Controls.ButtonPredefines.Combo)});
            this.repositoryIptalTarihi.Mask.MaskType = DevExpress.XtraEditors.Mask.MaskType.DateTimeAdvancingCaret;
            this.repositoryIptalTarihi.Name = "repositoryIptalTarihi";
            // 
            // colIptalNedeniId
            // 
            this.colIptalNedeniId.Caption = "IptalNedeniId";
            this.colIptalNedeniId.FieldName = "IptalNedeniId";
            this.colIptalNedeniId.Name = "colIptalNedeniId";
            this.colIptalNedeniId.OptionsColumn.AllowEdit = false;
            this.colIptalNedeniId.OptionsColumn.ShowInCustomizationForm = false;
            this.colIptalNedeniId.StatusBarAciklama = null;
            this.colIptalNedeniId.StatusBarKisaYol = null;
            this.colIptalNedeniId.StatusBarKisaYolAciklama = null;
            // 
            // colIptalNedeniAdi
            // 
            this.colIptalNedeniAdi.Caption = "İptal Nedeni";
            this.colIptalNedeniAdi.ColumnEdit = this.repositoryIptalNedeni;
            this.colIptalNedeniAdi.FieldName = "IptalNedeniAdi";
            this.colIptalNedeniAdi.Name = "colIptalNedeniAdi";
            this.colIptalNedeniAdi.OptionsColumn.AllowEdit = false;
            this.colIptalNedeniAdi.OptionsColumn.AllowMove = false;
            this.colIptalNedeniAdi.OptionsColumn.AllowShowHide = false;
            this.colIptalNedeniAdi.OptionsColumn.AllowSort = DevExpress.Utils.DefaultBoolean.True;
            this.colIptalNedeniAdi.OptionsFilter.AllowAutoFilter = false;
            this.colIptalNedeniAdi.OptionsFilter.AllowFilter = false;
            this.colIptalNedeniAdi.StatusBarAciklama = "İptal Nedeni Seçiniz";
            this.colIptalNedeniAdi.StatusBarKisaYol = "F4 :";
            this.colIptalNedeniAdi.StatusBarKisaYolAciklama = "Seçim Yap";
            this.colIptalNedeniAdi.Visible = true;
            this.colIptalNedeniAdi.VisibleIndex = 10;
            this.colIptalNedeniAdi.Width = 120;
            // 
            // repositoryIptalNedeni
            // 
            this.repositoryIptalNedeni.AutoHeight = false;
            this.repositoryIptalNedeni.Buttons.AddRange(new DevExpress.XtraEditors.Controls.EditorButton[] {
            new DevExpress.XtraEditors.Controls.EditorButton()});
            this.repositoryIptalNedeni.Name = "repositoryIptalNedeni";
            this.repositoryIptalNedeni.TextEditStyle = DevExpress.XtraEditors.Controls.TextEditStyles.DisableTextEditor;
            // 
            // colGittigiOkulId
            // 
            this.colGittigiOkulId.Caption = "GittigiOkulId";
            this.colGittigiOkulId.FieldName = "GittigiOkulId";
            this.colGittigiOkulId.Name = "colGittigiOkulId";
            this.colGittigiOkulId.OptionsColumn.AllowEdit = false;
            this.colGittigiOkulId.OptionsColumn.ShowInCustomizationForm = false;
            this.colGittigiOkulId.StatusBarAciklama = null;
            this.colGittigiOkulId.StatusBarKisaYol = null;
            this.colGittigiOkulId.StatusBarKisaYolAciklama = null;
            // 
            // colGittigiOkulAdi
            // 
            this.colGittigiOkulAdi.Caption = "Gittiği Okul Adı";
            this.colGittigiOkulAdi.ColumnEdit = this.repositoryGittigiOkul;
            this.colGittigiOkulAdi.FieldName = "GittigiOkulAdi";
            this.colGittigiOkulAdi.Name = "colGittigiOkulAdi";
            this.colGittigiOkulAdi.OptionsColumn.AllowEdit = false;
            this.colGittigiOkulAdi.OptionsColumn.AllowMove = false;
            this.colGittigiOkulAdi.OptionsColumn.AllowShowHide = false;
            this.colGittigiOkulAdi.OptionsColumn.AllowSort = DevExpress.Utils.DefaultBoolean.True;
            this.colGittigiOkulAdi.OptionsFilter.AllowAutoFilter = false;
            this.colGittigiOkulAdi.OptionsFilter.AllowFilter = false;
            this.colGittigiOkulAdi.StatusBarAciklama = "Gittiği Okul Seçiniz.";
            this.colGittigiOkulAdi.StatusBarKisaYol = "F4 :";
            this.colGittigiOkulAdi.StatusBarKisaYolAciklama = "Seçim Yap";
            this.colGittigiOkulAdi.Visible = true;
            this.colGittigiOkulAdi.VisibleIndex = 11;
            this.colGittigiOkulAdi.Width = 200;
            // 
            // repositoryGittigiOkul
            // 
            this.repositoryGittigiOkul.AutoHeight = false;
            this.repositoryGittigiOkul.Buttons.AddRange(new DevExpress.XtraEditors.Controls.EditorButton[] {
            new DevExpress.XtraEditors.Controls.EditorButton()});
            this.repositoryGittigiOkul.Name = "repositoryGittigiOkul";
            this.repositoryGittigiOkul.TextEditStyle = DevExpress.XtraEditors.Controls.TextEditStyles.DisableTextEditor;
            // 
            // colIptalAciklama
            // 
            this.colIptalAciklama.Caption = "Açıklama";
            this.colIptalAciklama.FieldName = "IptalAciklama";
            this.colIptalAciklama.Name = "colIptalAciklama";
            this.colIptalAciklama.OptionsColumn.AllowEdit = false;
            this.colIptalAciklama.OptionsColumn.AllowMove = false;
            this.colIptalAciklama.OptionsColumn.AllowShowHide = false;
            this.colIptalAciklama.OptionsColumn.AllowSort = DevExpress.Utils.DefaultBoolean.True;
            this.colIptalAciklama.OptionsFilter.AllowAutoFilter = false;
            this.colIptalAciklama.OptionsFilter.AllowFilter = false;
            this.colIptalAciklama.StatusBarAciklama = "İptal Açıklaması Giriniz";
            this.colIptalAciklama.StatusBarKisaYol = null;
            this.colIptalAciklama.StatusBarKisaYolAciklama = null;
            this.colIptalAciklama.Visible = true;
            this.colIptalAciklama.VisibleIndex = 12;
            this.colIptalAciklama.Width = 350;
            // 
            // HizmetBilgileriTable
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.Controls.Add(this.grid);
            this.Name = "HizmetBilgileriTable";
            this.Size = new System.Drawing.Size(945, 245);
            this.Controls.SetChildIndex(this.insUpNavigator, 0);
            this.Controls.SetChildIndex(this.grid, 0);
            ((System.ComponentModel.ISupportInitialize)(this.grid)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.tablo)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.repositoryTarih.CalendarTimeProperties)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.repositoryTarih)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.repositoryIDecimal)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.repositoryIptalTarihi.CalendarTimeProperties)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.repositoryIptalTarihi)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.repositoryIptalNedeni)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.repositoryGittigiOkul)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private Controls.Grid.myGridControl grid;
        private Controls.Grid.MyGridView tablo;
        private Controls.Grid.MyGridColumn colHizmetId;
        private Controls.Grid.MyGridColumn colHizmetAdi;
        private Controls.Grid.MyGridColumn colHizmetTuruId;
        private Controls.Grid.MyGridColumn colServisId;
        private Controls.Grid.MyGridColumn colServisYeriAdi;
        private Controls.Grid.MyGridColumn colIslemTarihi;
        private Controls.Grid.MyGridColumn colBaslamaTarihi;
        private Controls.Grid.MyGridColumn colBrutUcret;
        private Controls.Grid.MyGridColumn colKistDonemDusulenUcret;
        private Controls.Grid.MyGridColumn colNetUcret;
        private Controls.Grid.MyGridColumn colIptalEdildi;
        private Controls.Grid.MyGridColumn colEgitimDonemiGunSayisi;
        private Controls.Grid.MyGridColumn colAlinanHizmetGunSayisi;
        private Controls.Grid.MyGridColumn colGunlukUcret;
        private Controls.Grid.MyGridColumn colIptalTarihi;
        private Controls.Grid.MyGridColumn colIptalNedeniId;
        private Controls.Grid.MyGridColumn colIptalNedeniAdi;
        private Controls.Grid.MyGridColumn colGittigiOkulId;
        private Controls.Grid.MyGridColumn colGittigiOkulAdi;
        private Controls.Grid.MyGridColumn colIptalAciklama;
        private DevExpress.XtraEditors.Repository.RepositoryItemDateEdit repositoryTarih;
        private DevExpress.XtraEditors.Repository.RepositoryItemCalcEdit repositoryIDecimal;
        private DevExpress.XtraEditors.Repository.RepositoryItemButtonEdit repositoryIptalNedeni;
        private DevExpress.XtraEditors.Repository.RepositoryItemButtonEdit repositoryGittigiOkul;
        private DevExpress.XtraEditors.Repository.RepositoryItemDateEdit repositoryIptalTarihi;
    }
}

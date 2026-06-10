namespace AbcYazilim.OgrenciTakip.UI.Win.UserControls.UserControl.TahakkukEditFormTable
{
    partial class SinavBilgileriTable
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
            this.grid = new AbcYazilim.OgrenciTakip.UI.Win.UserControls.Controls.Grid.myGridControl();
            this.tablo = new AbcYazilim.OgrenciTakip.UI.Win.UserControls.Controls.Grid.MyGridView();
            this.colSinavAdi = new AbcYazilim.OgrenciTakip.UI.Win.UserControls.Controls.Grid.MyGridColumn();
            this.colTarih = new AbcYazilim.OgrenciTakip.UI.Win.UserControls.Controls.Grid.MyGridColumn();
            this.repositoryTarih = new DevExpress.XtraEditors.Repository.RepositoryItemDateEdit();
            this.colPuanTuru = new AbcYazilim.OgrenciTakip.UI.Win.UserControls.Controls.Grid.MyGridColumn();
            this.colPuan = new AbcYazilim.OgrenciTakip.UI.Win.UserControls.Controls.Grid.MyGridColumn();
            this.repositoryPuan = new DevExpress.XtraEditors.Repository.RepositoryItemSpinEdit();
            this.colSira = new AbcYazilim.OgrenciTakip.UI.Win.UserControls.Controls.Grid.MyGridColumn();
            this.repositorySira = new DevExpress.XtraEditors.Repository.RepositoryItemCalcEdit();
            this.colYuzde = new AbcYazilim.OgrenciTakip.UI.Win.UserControls.Controls.Grid.MyGridColumn();
            this.repositoryYuzde = new DevExpress.XtraEditors.Repository.RepositoryItemSpinEdit();
            ((System.ComponentModel.ISupportInitialize)(this.grid)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.tablo)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.repositoryTarih)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.repositoryTarih.CalendarTimeProperties)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.repositoryPuan)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.repositorySira)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.repositoryYuzde)).BeginInit();
            this.SuspendLayout();
            // 
            // insUpNavigator
            // 
            this.insUpNavigator.Location = new System.Drawing.Point(0, 226);
            this.insUpNavigator.Size = new System.Drawing.Size(561, 24);
            // 
            // grid
            // 
            this.grid.Dock = System.Windows.Forms.DockStyle.Fill;
            this.grid.Location = new System.Drawing.Point(0, 0);
            this.grid.MainView = this.tablo;
            this.grid.Name = "grid";
            this.grid.RepositoryItems.AddRange(new DevExpress.XtraEditors.Repository.RepositoryItem[] {
            this.repositorySira,
            this.repositoryTarih,
            this.repositoryPuan,
            this.repositoryYuzde});
            this.grid.Size = new System.Drawing.Size(561, 226);
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
            this.colSinavAdi,
            this.colTarih,
            this.colPuanTuru,
            this.colPuan,
            this.colSira,
            this.colYuzde});
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
            this.tablo.OptionsView.HeaderFilterButtonShowMode = DevExpress.XtraEditors.Controls.FilterButtonShowMode.Button;
            this.tablo.OptionsView.RowAutoHeight = true;
            this.tablo.OptionsView.ShowGroupPanel = false;
            this.tablo.OptionsView.ShowViewCaption = true;
            this.tablo.StatusBarAciklama = "Sınav Bilgileri Giriniz.";
            this.tablo.StatusBarKisaYol = "Shift+Insert";
            this.tablo.StatusBarKisaYolAciklama = "Bilgi Girin";
            this.tablo.ViewCaption = "Sınav Bilgileri";
            // 
            // colSinavAdi
            // 
            this.colSinavAdi.Caption = "Sınav Adı";
            this.colSinavAdi.FieldName = "SinavAdi";
            this.colSinavAdi.Name = "colSinavAdi";
            this.colSinavAdi.StatusBarAciklama = "Sınav Adı Giriniz";
            this.colSinavAdi.StatusBarKisaYol = null;
            this.colSinavAdi.StatusBarKisaYolAciklama = null;
            this.colSinavAdi.Visible = true;
            this.colSinavAdi.VisibleIndex = 0;
            this.colSinavAdi.Width = 120;
            // 
            // colTarih
            // 
            this.colTarih.AppearanceCell.Options.UseTextOptions = true;
            this.colTarih.AppearanceCell.TextOptions.HAlignment = DevExpress.Utils.HorzAlignment.Center;
            this.colTarih.Caption = "Tarih";
            this.colTarih.ColumnEdit = this.repositoryTarih;
            this.colTarih.FieldName = "Tarih";
            this.colTarih.Name = "colTarih";
            this.colTarih.StatusBarAciklama = "Tarih Seçiniz";
            this.colTarih.StatusBarKisaYol = "F4 :";
            this.colTarih.StatusBarKisaYolAciklama = "Tarih Seç";
            this.colTarih.Visible = true;
            this.colTarih.VisibleIndex = 1;
            this.colTarih.Width = 100;
            // 
            // repositoryTarih
            // 
            this.repositoryTarih.AllowNullInput = DevExpress.Utils.DefaultBoolean.False;
            this.repositoryTarih.AutoHeight = false;
            this.repositoryTarih.Buttons.AddRange(new DevExpress.XtraEditors.Controls.EditorButton[] {
            new DevExpress.XtraEditors.Controls.EditorButton(DevExpress.XtraEditors.Controls.ButtonPredefines.Combo)});
            this.repositoryTarih.CalendarTimeProperties.Buttons.AddRange(new DevExpress.XtraEditors.Controls.EditorButton[] {
            new DevExpress.XtraEditors.Controls.EditorButton(DevExpress.XtraEditors.Controls.ButtonPredefines.Combo)});
            this.repositoryTarih.Mask.MaskType = DevExpress.XtraEditors.Mask.MaskType.DateTimeAdvancingCaret;
            this.repositoryTarih.Name = "repositoryTarih";
            // 
            // colPuanTuru
            // 
            this.colPuanTuru.Caption = "Puan Türü";
            this.colPuanTuru.FieldName = "PuanTuru";
            this.colPuanTuru.Name = "colPuanTuru";
            this.colPuanTuru.StatusBarAciklama = "Puan Türü Giriniz";
            this.colPuanTuru.StatusBarKisaYol = null;
            this.colPuanTuru.StatusBarKisaYolAciklama = null;
            this.colPuanTuru.Visible = true;
            this.colPuanTuru.VisibleIndex = 2;
            this.colPuanTuru.Width = 80;
            // 
            // colPuan
            // 
            this.colPuan.Caption = "Puan";
            this.colPuan.ColumnEdit = this.repositoryPuan;
            this.colPuan.FieldName = "Puan";
            this.colPuan.Name = "colPuan";
            this.colPuan.StatusBarAciklama = "Puan Giriniz";
            this.colPuan.StatusBarKisaYol = null;
            this.colPuan.StatusBarKisaYolAciklama = null;
            this.colPuan.Visible = true;
            this.colPuan.VisibleIndex = 3;
            // 
            // repositoryPuan
            // 
            this.repositoryPuan.AllowNullInput = DevExpress.Utils.DefaultBoolean.False;
            this.repositoryPuan.AutoHeight = false;
            this.repositoryPuan.Buttons.AddRange(new DevExpress.XtraEditors.Controls.EditorButton[] {
            new DevExpress.XtraEditors.Controls.EditorButton(DevExpress.XtraEditors.Controls.ButtonPredefines.Combo)});
            this.repositoryPuan.DisplayFormat.FormatString = "n5";
            this.repositoryPuan.DisplayFormat.FormatType = DevExpress.Utils.FormatType.Numeric;
            this.repositoryPuan.EditFormat.FormatString = "n5";
            this.repositoryPuan.EditFormat.FormatType = DevExpress.Utils.FormatType.Numeric;
            this.repositoryPuan.MaskSettings.Set("mask", "n5");
            this.repositoryPuan.MaxValue = new decimal(new int[] {
            99999999,
            0,
            0,
            327680});
            this.repositoryPuan.Name = "repositoryPuan";
            // 
            // colSira
            // 
            this.colSira.Caption = "Sıra";
            this.colSira.ColumnEdit = this.repositorySira;
            this.colSira.FieldName = "Sira";
            this.colSira.Name = "colSira";
            this.colSira.StatusBarAciklama = "Sınav Sırası Giriniz";
            this.colSira.StatusBarKisaYol = null;
            this.colSira.StatusBarKisaYolAciklama = null;
            this.colSira.Visible = true;
            this.colSira.VisibleIndex = 4;
            // 
            // repositorySira
            // 
            this.repositorySira.AllowNullInput = DevExpress.Utils.DefaultBoolean.False;
            this.repositorySira.AutoHeight = false;
            this.repositorySira.Buttons.AddRange(new DevExpress.XtraEditors.Controls.EditorButton[] {
            new DevExpress.XtraEditors.Controls.EditorButton(DevExpress.XtraEditors.Controls.ButtonPredefines.Combo)});
            this.repositorySira.DisplayFormat.FormatString = "n0";
            this.repositorySira.DisplayFormat.FormatType = DevExpress.Utils.FormatType.Numeric;
            this.repositorySira.EditFormat.FormatString = "n0";
            this.repositorySira.EditFormat.FormatType = DevExpress.Utils.FormatType.Numeric;
            this.repositorySira.MaskSettings.Set("mask", "n0");
            this.repositorySira.Name = "repositorySira";
            // 
            // colYuzde
            // 
            this.colYuzde.Caption = "Derece (%)";
            this.colYuzde.ColumnEdit = this.repositoryYuzde;
            this.colYuzde.FieldName = "Yuzde";
            this.colYuzde.Name = "colYuzde";
            this.colYuzde.StatusBarAciklama = "Sınav Başarı Yüzdesi Giriniz.";
            this.colYuzde.StatusBarKisaYol = null;
            this.colYuzde.StatusBarKisaYolAciklama = null;
            this.colYuzde.Visible = true;
            this.colYuzde.VisibleIndex = 5;
            // 
            // repositoryYuzde
            // 
            this.repositoryYuzde.AllowNullInput = DevExpress.Utils.DefaultBoolean.False;
            this.repositoryYuzde.AutoHeight = false;
            this.repositoryYuzde.Buttons.AddRange(new DevExpress.XtraEditors.Controls.EditorButton[] {
            new DevExpress.XtraEditors.Controls.EditorButton(DevExpress.XtraEditors.Controls.ButtonPredefines.Combo)});
            this.repositoryYuzde.DisplayFormat.FormatString = "n4";
            this.repositoryYuzde.DisplayFormat.FormatType = DevExpress.Utils.FormatType.Numeric;
            this.repositoryYuzde.EditFormat.FormatString = "n4";
            this.repositoryYuzde.EditFormat.FormatType = DevExpress.Utils.FormatType.Numeric;
            this.repositoryYuzde.MaskSettings.Set("mask", "n4");
            this.repositoryYuzde.MaxValue = new decimal(new int[] {
            100,
            0,
            0,
            0});
            this.repositoryYuzde.Name = "repositoryYuzde";
            // 
            // SinavBilgileriTable
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.Controls.Add(this.grid);
            this.Name = "SinavBilgileriTable";
            this.Size = new System.Drawing.Size(561, 250);
            this.Controls.SetChildIndex(this.insUpNavigator, 0);
            this.Controls.SetChildIndex(this.grid, 0);
            ((System.ComponentModel.ISupportInitialize)(this.grid)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.tablo)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.repositoryTarih.CalendarTimeProperties)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.repositoryTarih)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.repositoryPuan)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.repositorySira)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.repositoryYuzde)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private Controls.Grid.myGridControl grid;
        private Controls.Grid.MyGridView tablo;
        private Controls.Grid.MyGridColumn colSinavAdi;
        private Controls.Grid.MyGridColumn colTarih;
        private DevExpress.XtraEditors.Repository.RepositoryItemDateEdit repositoryTarih;
        private Controls.Grid.MyGridColumn colPuanTuru;
        private Controls.Grid.MyGridColumn colPuan;
        private DevExpress.XtraEditors.Repository.RepositoryItemSpinEdit repositoryPuan;
        private Controls.Grid.MyGridColumn colSira;
        private DevExpress.XtraEditors.Repository.RepositoryItemCalcEdit repositorySira;
        private Controls.Grid.MyGridColumn colYuzde;
        private DevExpress.XtraEditors.Repository.RepositoryItemSpinEdit repositoryYuzde;
    }
}

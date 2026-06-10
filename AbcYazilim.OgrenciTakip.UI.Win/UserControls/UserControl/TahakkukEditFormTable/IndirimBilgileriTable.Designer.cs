namespace AbcYazilim.OgrenciTakip.UI.Win.UserControls.UserControl.TahakkukEditFormTable
{
    partial class IndirimBilgileriTable
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
            this.colIndirimAdi = new AbcYazilim.OgrenciTakip.UI.Win.UserControls.Controls.Grid.MyGridColumn();
            this.colHizmetAdi = new AbcYazilim.OgrenciTakip.UI.Win.UserControls.Controls.Grid.MyGridColumn();
            this.colIslemTarihi = new AbcYazilim.OgrenciTakip.UI.Win.UserControls.Controls.Grid.MyGridColumn();
            this.repositoryTarih = new DevExpress.XtraEditors.Repository.RepositoryItemDateEdit();
            this.colIptalTarihi = new AbcYazilim.OgrenciTakip.UI.Win.UserControls.Controls.Grid.MyGridColumn();
            this.repositoryIptalTarih = new DevExpress.XtraEditors.Repository.RepositoryItemDateEdit();
            this.colBrutIndirim = new AbcYazilim.OgrenciTakip.UI.Win.UserControls.Controls.Grid.MyGridColumn();
            this.repositoryDecimal = new DevExpress.XtraEditors.Repository.RepositoryItemCalcEdit();
            this.colKistDonemDusulenIndirim = new AbcYazilim.OgrenciTakip.UI.Win.UserControls.Controls.Grid.MyGridColumn();
            this.colNetIndirim = new AbcYazilim.OgrenciTakip.UI.Win.UserControls.Controls.Grid.MyGridColumn();
            this.colIptalNedeniId = new AbcYazilim.OgrenciTakip.UI.Win.UserControls.Controls.Grid.MyGridColumn();
            this.colIptalNedeniAdi = new AbcYazilim.OgrenciTakip.UI.Win.UserControls.Controls.Grid.MyGridColumn();
            this.repositoryIptalNedeni = new DevExpress.XtraEditors.Repository.RepositoryItemButtonEdit();
            this.colIptalAciklama = new AbcYazilim.OgrenciTakip.UI.Win.UserControls.Controls.Grid.MyGridColumn();
            this.colIptalEdildi = new AbcYazilim.OgrenciTakip.UI.Win.UserControls.Controls.Grid.MyGridColumn();
            ((System.ComponentModel.ISupportInitialize)(this.grid)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.tablo)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.repositoryTarih)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.repositoryTarih.CalendarTimeProperties)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.repositoryIptalTarih)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.repositoryIptalTarih.CalendarTimeProperties)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.repositoryDecimal)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.repositoryIptalNedeni)).BeginInit();
            this.SuspendLayout();
            // 
            // insUpNavigator
            // 
            this.insUpNavigator.Location = new System.Drawing.Point(0, 199);
            this.insUpNavigator.Size = new System.Drawing.Size(710, 24);
            // 
            // grid
            // 
            this.grid.Dock = System.Windows.Forms.DockStyle.Fill;
            this.grid.Location = new System.Drawing.Point(0, 0);
            this.grid.MainView = this.tablo;
            this.grid.Name = "grid";
            this.grid.RepositoryItems.AddRange(new DevExpress.XtraEditors.Repository.RepositoryItem[] {
            this.repositoryIptalTarih,
            this.repositoryIptalNedeni,
            this.repositoryDecimal,
            this.repositoryTarih});
            this.grid.Size = new System.Drawing.Size(710, 199);
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
            this.colIndirimAdi,
            this.colHizmetAdi,
            this.colIslemTarihi,
            this.colIptalTarihi,
            this.colIptalEdildi,
            this.colBrutIndirim,
            this.colKistDonemDusulenIndirim,
            this.colNetIndirim,
            this.colIptalNedeniId,
            this.colIptalNedeniAdi,
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
            this.tablo.StatusBarAciklama = "Öğrenciye Uygulanan İndirimleri Seçinin";
            this.tablo.StatusBarKisaYol = "Shift+Insert :";
            this.tablo.StatusBarKisaYolAciklama = "Seçim Yap";
            this.tablo.ViewCaption = "İndirim Bilgileri";
            // 
            // colIndirimAdi
            // 
            this.colIndirimAdi.Caption = "İndirim Adı";
            this.colIndirimAdi.FieldName = "IndirimAdi";
            this.colIndirimAdi.Name = "colIndirimAdi";
            this.colIndirimAdi.OptionsColumn.AllowEdit = false;
            this.colIndirimAdi.OptionsColumn.AllowSort = DevExpress.Utils.DefaultBoolean.False;
            this.colIndirimAdi.OptionsFilter.AllowAutoFilter = false;
            this.colIndirimAdi.OptionsFilter.AllowFilter = false;
            this.colIndirimAdi.StatusBarAciklama = null;
            this.colIndirimAdi.StatusBarKisaYol = null;
            this.colIndirimAdi.StatusBarKisaYolAciklama = null;
            this.colIndirimAdi.Visible = true;
            this.colIndirimAdi.VisibleIndex = 0;
            this.colIndirimAdi.Width = 150;
            // 
            // colHizmetAdi
            // 
            this.colHizmetAdi.Caption = "Indirimin Uygulanacağı Hizmet";
            this.colHizmetAdi.FieldName = "HizmetAdi";
            this.colHizmetAdi.Name = "colHizmetAdi";
            this.colHizmetAdi.OptionsColumn.AllowEdit = false;
            this.colHizmetAdi.OptionsColumn.AllowSort = DevExpress.Utils.DefaultBoolean.False;
            this.colHizmetAdi.OptionsFilter.AllowAutoFilter = false;
            this.colHizmetAdi.OptionsFilter.AllowFilter = false;
            this.colHizmetAdi.StatusBarAciklama = null;
            this.colHizmetAdi.StatusBarKisaYol = null;
            this.colHizmetAdi.StatusBarKisaYolAciklama = null;
            this.colHizmetAdi.Visible = true;
            this.colHizmetAdi.VisibleIndex = 1;
            this.colHizmetAdi.Width = 175;
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
            this.colIslemTarihi.OptionsColumn.AllowSort = DevExpress.Utils.DefaultBoolean.False;
            this.colIslemTarihi.OptionsFilter.AllowAutoFilter = false;
            this.colIslemTarihi.OptionsFilter.AllowFilter = false;
            this.colIslemTarihi.StatusBarAciklama = null;
            this.colIslemTarihi.StatusBarKisaYol = null;
            this.colIslemTarihi.StatusBarKisaYolAciklama = null;
            this.colIslemTarihi.Visible = true;
            this.colIslemTarihi.VisibleIndex = 2;
            this.colIslemTarihi.Width = 90;
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
            // colIptalTarihi
            // 
            this.colIptalTarihi.AppearanceCell.Options.UseTextOptions = true;
            this.colIptalTarihi.AppearanceCell.TextOptions.HAlignment = DevExpress.Utils.HorzAlignment.Center;
            this.colIptalTarihi.Caption = "İptal Tarihi";
            this.colIptalTarihi.ColumnEdit = this.repositoryIptalTarih;
            this.colIptalTarihi.FieldName = "IptalTarihi";
            this.colIptalTarihi.Name = "colIptalTarihi";
            this.colIptalTarihi.OptionsColumn.AllowEdit = false;
            this.colIptalTarihi.OptionsColumn.AllowSort = DevExpress.Utils.DefaultBoolean.False;
            this.colIptalTarihi.OptionsFilter.AllowAutoFilter = false;
            this.colIptalTarihi.OptionsFilter.AllowFilter = false;
            this.colIptalTarihi.StatusBarAciklama = null;
            this.colIptalTarihi.StatusBarKisaYol = null;
            this.colIptalTarihi.StatusBarKisaYolAciklama = null;
            this.colIptalTarihi.Visible = true;
            this.colIptalTarihi.VisibleIndex = 6;
            this.colIptalTarihi.Width = 90;
            // 
            // repositoryIptalTarih
            // 
            this.repositoryIptalTarih.AutoHeight = false;
            this.repositoryIptalTarih.Buttons.AddRange(new DevExpress.XtraEditors.Controls.EditorButton[] {
            new DevExpress.XtraEditors.Controls.EditorButton(DevExpress.XtraEditors.Controls.ButtonPredefines.Combo)});
            this.repositoryIptalTarih.CalendarTimeProperties.Buttons.AddRange(new DevExpress.XtraEditors.Controls.EditorButton[] {
            new DevExpress.XtraEditors.Controls.EditorButton(DevExpress.XtraEditors.Controls.ButtonPredefines.Combo)});
            this.repositoryIptalTarih.MaskSettings.Set("MaskManagerType", typeof(DevExpress.Data.Mask.DateTimeMaskManager));
            this.repositoryIptalTarih.MaskSettings.Set("useAdvancingCaret", true);
            this.repositoryIptalTarih.Name = "repositoryIptalTarih";
            // 
            // colBrutIndirim
            // 
            this.colBrutIndirim.Caption = "Brüt İndirim";
            this.colBrutIndirim.ColumnEdit = this.repositoryDecimal;
            this.colBrutIndirim.FieldName = "BrutIndirim";
            this.colBrutIndirim.Name = "colBrutIndirim";
            this.colBrutIndirim.OptionsColumn.AllowEdit = false;
            this.colBrutIndirim.OptionsColumn.AllowSort = DevExpress.Utils.DefaultBoolean.False;
            this.colBrutIndirim.OptionsFilter.AllowAutoFilter = false;
            this.colBrutIndirim.OptionsFilter.AllowFilter = false;
            this.colBrutIndirim.StatusBarAciklama = "Tutar Giriniz";
            this.colBrutIndirim.StatusBarKisaYol = "F4 :";
            this.colBrutIndirim.StatusBarKisaYolAciklama = "Hesap Makinesi";
            this.colBrutIndirim.Summary.AddRange(new DevExpress.XtraGrid.GridSummaryItem[] {
            new DevExpress.XtraGrid.GridColumnSummaryItem(DevExpress.Data.SummaryItemType.Sum, "BrutIndirim", "{0:n2}")});
            this.colBrutIndirim.Visible = true;
            this.colBrutIndirim.VisibleIndex = 3;
            this.colBrutIndirim.Width = 90;
            // 
            // repositoryDecimal
            // 
            this.repositoryDecimal.AutoHeight = false;
            this.repositoryDecimal.Buttons.AddRange(new DevExpress.XtraEditors.Controls.EditorButton[] {
            new DevExpress.XtraEditors.Controls.EditorButton(DevExpress.XtraEditors.Controls.ButtonPredefines.Combo)});
            this.repositoryDecimal.DisplayFormat.FormatString = "{0:n2}";
            this.repositoryDecimal.DisplayFormat.FormatType = DevExpress.Utils.FormatType.Numeric;
            this.repositoryDecimal.EditFormat.FormatString = "{0:n2}";
            this.repositoryDecimal.EditFormat.FormatType = DevExpress.Utils.FormatType.Numeric;
            this.repositoryDecimal.MaskSettings.Set("mask", "n2");
            this.repositoryDecimal.Name = "repositoryDecimal";
            // 
            // colKistDonemDusulenIndirim
            // 
            this.colKistDonemDusulenIndirim.Caption = "Kıst Dönem Düşünülen İndirim";
            this.colKistDonemDusulenIndirim.ColumnEdit = this.repositoryDecimal;
            this.colKistDonemDusulenIndirim.FieldName = "KistDonemDusulenIndirim";
            this.colKistDonemDusulenIndirim.Name = "colKistDonemDusulenIndirim";
            this.colKistDonemDusulenIndirim.OptionsColumn.AllowEdit = false;
            this.colKistDonemDusulenIndirim.OptionsColumn.AllowSort = DevExpress.Utils.DefaultBoolean.False;
            this.colKistDonemDusulenIndirim.OptionsFilter.AllowAutoFilter = false;
            this.colKistDonemDusulenIndirim.OptionsFilter.AllowFilter = false;
            this.colKistDonemDusulenIndirim.StatusBarAciklama = "Tutar Giriniz";
            this.colKistDonemDusulenIndirim.StatusBarKisaYol = "F4 :";
            this.colKistDonemDusulenIndirim.StatusBarKisaYolAciklama = "Hesap Makinesi";
            this.colKistDonemDusulenIndirim.Summary.AddRange(new DevExpress.XtraGrid.GridSummaryItem[] {
            new DevExpress.XtraGrid.GridColumnSummaryItem(DevExpress.Data.SummaryItemType.Sum, "KistDonemDusulenIndirim", "{0:n2}")});
            this.colKistDonemDusulenIndirim.Visible = true;
            this.colKistDonemDusulenIndirim.VisibleIndex = 4;
            this.colKistDonemDusulenIndirim.Width = 110;
            // 
            // colNetIndirim
            // 
            this.colNetIndirim.Caption = "Net İndirim";
            this.colNetIndirim.ColumnEdit = this.repositoryDecimal;
            this.colNetIndirim.FieldName = "NetIndirim";
            this.colNetIndirim.Name = "colNetIndirim";
            this.colNetIndirim.OptionsColumn.AllowEdit = false;
            this.colNetIndirim.OptionsColumn.AllowSort = DevExpress.Utils.DefaultBoolean.False;
            this.colNetIndirim.OptionsFilter.AllowAutoFilter = false;
            this.colNetIndirim.OptionsFilter.AllowFilter = false;
            this.colNetIndirim.StatusBarAciklama = null;
            this.colNetIndirim.StatusBarKisaYol = null;
            this.colNetIndirim.StatusBarKisaYolAciklama = null;
            this.colNetIndirim.Summary.AddRange(new DevExpress.XtraGrid.GridSummaryItem[] {
            new DevExpress.XtraGrid.GridColumnSummaryItem(DevExpress.Data.SummaryItemType.Sum, "NetIndirim", "{0:n2}")});
            this.colNetIndirim.Visible = true;
            this.colNetIndirim.VisibleIndex = 5;
            this.colNetIndirim.Width = 90;
            // 
            // colIptalNedeniId
            // 
            this.colIptalNedeniId.Caption = "İptal Nedeni Id";
            this.colIptalNedeniId.FieldName = "IptalNedeniId";
            this.colIptalNedeniId.Name = "colIptalNedeniId";
            this.colIptalNedeniId.OptionsColumn.AllowEdit = false;
            this.colIptalNedeniId.OptionsColumn.AllowSort = DevExpress.Utils.DefaultBoolean.False;
            this.colIptalNedeniId.OptionsColumn.ShowInCustomizationForm = false;
            this.colIptalNedeniId.OptionsFilter.AllowAutoFilter = false;
            this.colIptalNedeniId.OptionsFilter.AllowFilter = false;
            this.colIptalNedeniId.StatusBarAciklama = null;
            this.colIptalNedeniId.StatusBarKisaYol = null;
            this.colIptalNedeniId.StatusBarKisaYolAciklama = null;
            // 
            // colIptalNedeniAdi
            // 
            this.colIptalNedeniAdi.Caption = "İptal Nedeni";
            this.colIptalNedeniAdi.ColumnEdit = this.repositoryIptalNedeni;
            this.colIptalNedeniAdi.FieldName = "IptalNedeni";
            this.colIptalNedeniAdi.Name = "colIptalNedeniAdi";
            this.colIptalNedeniAdi.OptionsColumn.AllowEdit = false;
            this.colIptalNedeniAdi.OptionsColumn.AllowSort = DevExpress.Utils.DefaultBoolean.False;
            this.colIptalNedeniAdi.OptionsFilter.AllowAutoFilter = false;
            this.colIptalNedeniAdi.OptionsFilter.AllowFilter = false;
            this.colIptalNedeniAdi.StatusBarAciklama = "İptal Nedeni Seçiniz";
            this.colIptalNedeniAdi.StatusBarKisaYol = "F4 :";
            this.colIptalNedeniAdi.StatusBarKisaYolAciklama = "Seçim Yap";
            this.colIptalNedeniAdi.Visible = true;
            this.colIptalNedeniAdi.VisibleIndex = 7;
            this.colIptalNedeniAdi.Width = 90;
            // 
            // repositoryIptalNedeni
            // 
            this.repositoryIptalNedeni.AutoHeight = false;
            this.repositoryIptalNedeni.Buttons.AddRange(new DevExpress.XtraEditors.Controls.EditorButton[] {
            new DevExpress.XtraEditors.Controls.EditorButton()});
            this.repositoryIptalNedeni.Name = "repositoryIptalNedeni";
            // 
            // colIptalAciklama
            // 
            this.colIptalAciklama.Caption = "Açıklama";
            this.colIptalAciklama.FieldName = "IptalAciklama";
            this.colIptalAciklama.Name = "colIptalAciklama";
            this.colIptalAciklama.OptionsColumn.AllowEdit = false;
            this.colIptalAciklama.OptionsColumn.AllowSort = DevExpress.Utils.DefaultBoolean.False;
            this.colIptalAciklama.OptionsFilter.AllowAutoFilter = false;
            this.colIptalAciklama.OptionsFilter.AllowFilter = false;
            this.colIptalAciklama.StatusBarAciklama = null;
            this.colIptalAciklama.StatusBarKisaYol = null;
            this.colIptalAciklama.StatusBarKisaYolAciklama = null;
            this.colIptalAciklama.Visible = true;
            this.colIptalAciklama.VisibleIndex = 8;
            this.colIptalAciklama.Width = 250;
            // 
            // colIptalEdildi
            // 
            this.colIptalEdildi.Caption = "İptal Edildi";
            this.colIptalEdildi.FieldName = "IptalEdildi";
            this.colIptalEdildi.Name = "colIptalEdildi";
            this.colIptalEdildi.OptionsColumn.AllowEdit = false;
            this.colIptalEdildi.OptionsColumn.ShowInCustomizationForm = false;
            this.colIptalEdildi.StatusBarAciklama = "Tarih Seçinin";
            this.colIptalEdildi.StatusBarKisaYol = "F4 :";
            this.colIptalEdildi.StatusBarKisaYolAciklama = "Seçim Yap";
            // 
            // IndirimBilgileriTable
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.Controls.Add(this.grid);
            this.Name = "IndirimBilgileriTable";
            this.Size = new System.Drawing.Size(710, 223);
            this.Controls.SetChildIndex(this.insUpNavigator, 0);
            this.Controls.SetChildIndex(this.grid, 0);
            ((System.ComponentModel.ISupportInitialize)(this.grid)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.tablo)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.repositoryTarih.CalendarTimeProperties)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.repositoryTarih)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.repositoryIptalTarih.CalendarTimeProperties)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.repositoryIptalTarih)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.repositoryDecimal)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.repositoryIptalNedeni)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private Controls.Grid.myGridControl grid;
        private Controls.Grid.MyGridView tablo;
        private Controls.Grid.MyGridColumn colIndirimAdi;
        private Controls.Grid.MyGridColumn colHizmetAdi;
        private Controls.Grid.MyGridColumn colIslemTarihi;
        private DevExpress.XtraEditors.Repository.RepositoryItemDateEdit repositoryTarih;
        private Controls.Grid.MyGridColumn colIptalTarihi;
        private DevExpress.XtraEditors.Repository.RepositoryItemDateEdit repositoryIptalTarih;
        private Controls.Grid.MyGridColumn colBrutIndirim;
        private DevExpress.XtraEditors.Repository.RepositoryItemCalcEdit repositoryDecimal;
        private Controls.Grid.MyGridColumn colKistDonemDusulenIndirim;
        private Controls.Grid.MyGridColumn colNetIndirim;
        private Controls.Grid.MyGridColumn colIptalNedeniId;
        private Controls.Grid.MyGridColumn colIptalNedeniAdi;
        private DevExpress.XtraEditors.Repository.RepositoryItemButtonEdit repositoryIptalNedeni;
        private Controls.Grid.MyGridColumn colIptalAciklama;
        private Controls.Grid.MyGridColumn colIptalEdildi;
    }
}

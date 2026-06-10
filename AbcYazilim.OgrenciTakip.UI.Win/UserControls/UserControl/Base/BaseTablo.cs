using System;
using System.Windows.Forms;
using AbcYazilim.OgrenciTakip.Common.Message;
using DevExpress.XtraBars;
using DevExpress.XtraEditors;
using DevExpress.XtraGrid.Views.Grid;
using AbcYazilim.OgrenciTakip.UI.Win.Functions;
using AbcYazilim.OgrenciTakip.Model.Entities.Base.Interfaces;
using AbcYazilim.OgrenciTakip.UI.Win.Forms.BaseForms;
using DevExpress.Utils.Extensions;
using DevExpress.XtraGrid.Views.Base;
using AbcYazilim.OgrenciTakip.UI.Win.Interfaces;
using System.Linq;
using AbcYazilim.OgrenciTakip.Bll.Interfaces;
using AbcYazilim.OgrenciTakip.Model.Entities.Base;
using System.Collections.Generic;
using DevExpress.XtraGrid.Columns;
using DevExpress.XtraEditors.Repository;

namespace AbcYazilim.OgrenciTakip.UI.Win.UserControls.UserControl.Base
{
    public partial class BaseTablo : XtraUserControl
    {
        private bool _isLoaded;
        private bool _tabloSablonKayitEdilecek;
        protected internal GridView Tablo;
        protected internal bool TableValueChanged;
        protected internal BaseEditForm OwnerForm;
        protected BarItem[] ShowItems;
        protected BarItem[] HideItems;
        protected IBaseBll Bll;
        protected IList<long> ListeDisiTutulacakKayitlar;

        public BaseTablo()
        {
            InitializeComponent();
        }
        protected void EventsLoad()
        {
            // Button Events
            foreach (BarItem button in barManager.Items)
                button.ItemClick += Button_ItemClick;

            foreach (GridColumn column in Tablo.Columns)
            {
                if (column.ColumnEdit == null) continue;
                var type = column.ColumnEdit.GetType();

                if (type == typeof(RepositoryItemImageComboBox))
                    ((RepositoryItemImageComboBox)column.ColumnEdit).SelectedValueChanged += ImageComboBox_SelectedValueChanged;

                if (type == typeof(RepositoryItemCheckEdit))
                    ((RepositoryItemCheckEdit)column.ColumnEdit).CheckedChanged += CheckEdit_CheckedChanged;
            }
            //Navigator Enevets
            insUpNavigator.Navigator.ButtonClick += Navigator_ButtonClick;

            //Table Events
            Tablo.CellValueChanged += Tablo_CellValueChanged;
            Tablo.MouseUp += Tablo_MouseUp;
            Tablo.GotFocus += Tablo_GotFocus;
            Tablo.LostFocus += Tablo_LostFocus;
            Tablo.KeyDown += Tablo_KeyDown;
            Tablo.FocusedColumnChanged += Tablo_FocusedColumnChanged;
            Tablo.ColumnPositionChanged += Tablo_SablonChanged;
            Tablo.ColumnWidthChanged += Tablo_SablonChanged;
            Tablo.EndSorting += Tablo_SablonChanged;
            Tablo.DoubleClick += Tablo_DoubleClick;
            Tablo.FocusedRowObjectChanged += Tablo_FocusedRowObjectChanged;
            Tablo.RowCountChanged += Tablo_RowCountChanged;
        }


        protected internal void Yukle()
        {
            _isLoaded = true;
            TableValueChanged = false;
            OwnerForm.ButonEnabledDurumu();
            insUpNavigator.Navigator.NavigatableControl = Tablo.GridControl;
            SablonYukle();
            Listele();
            ButonGizleGoster();
            Tablo_LostFocus(Tablo, EventArgs.Empty);
        }
        private void SablonKaydet()
        {
            if (_tabloSablonKayitEdilecek)
                Tablo.TabloSablonKaydet(Tablo.ViewCaption);
        }
        private void SablonYukle()
        {
            Tablo.TabloSablonYukle(Tablo.ViewCaption);
        }
        protected virtual void Listele() { }
        private void ButonGizleGoster()
        {
            ShowItems?.ForEach(x => x.Visibility = BarItemVisibility.Always);
            HideItems?.ForEach(x => x.Visibility = BarItemVisibility.Never);
        }

        protected virtual void HareketEkle() { }
        protected virtual void HareketSil()
        {
            if (Tablo.DataRowCount == 0) return;
            if (Messages.SilMesaj("İşlem Satırı") != DialogResult.Yes) return;

            Tablo.GetRow<IBaseHareketEntity>().Delete = true;
            Tablo.RefreshDataSource();
            ButonEnableDurumu(true);
        }
        protected void ButonEnableDurumu(bool durum)
        {
            TableValueChanged = durum;
            OwnerForm.ButonEnabledDurumu();
        }
        protected internal virtual bool HataliGiris() { return false; }
        protected virtual void OpenEntity() { }
        protected virtual void SutunGizleGoster() { }
        protected virtual void RowCellAllowEdit() { }
        protected virtual void IptalEt() { }
        protected virtual void IptalGeriAl() { }
        protected internal bool Kaydet()
        {
            insUpNavigator.Navigator.Buttons.DoClick(insUpNavigator.Navigator.Buttons.EndEdit);
            var source = Tablo.DataController.ListSource;

            var insert = source.Cast<IBaseHareketEntity>().Where(x => x.Insert && !x.Delete).Cast<BaseHareketEntity>().ToList();
            var update = source.Cast<IBaseHareketEntity>().Where(x => x.Update && !x.Delete).Cast<BaseHareketEntity>().ToList();
            var delete = source.Cast<IBaseHareketEntity>().Where(x => x.Delete && !x.Insert).Cast<BaseHareketEntity>().ToList();
            if (insert.Any())
                if (!((IBaseHareketGenelBll)Bll).Insert(insert))
                {
                    Messages.HataMesaji($"{Tablo.ViewCaption} Tablosundaki Hareketler Eklenemedi.");
                    return false;
                }
            if (update.Any())
                if (!((IBaseHareketGenelBll)Bll).Update(update))
                {
                    Messages.HataMesaji($"{Tablo.ViewCaption} Tablosundaki Hareketler Güncellenemedi.");
                    return false;
                }
            if (delete.Any())
                if (!((IBaseHareketGenelBll)Bll).Delete(delete))
                {
                    Messages.HataMesaji($"{Tablo.ViewCaption} Tablosundaki Hareketler Silinemedi.");
                    return false;
                }
            ButonEnableDurumu(false);
            return true;
        }
        protected virtual void BelgeHareketleri() { }
        private void Button_ItemClick(object sender, ItemClickEventArgs e)
        {
            Cursor.Current = Cursors.WaitCursor;

            if (e.Item == btnHareketEkle)
                HareketEkle();
            else if (e.Item == btnHareketSil)
                HareketSil();
            else if (e.Item == btnKartDuzenle)
                OpenEntity();
            else if (e.Item == btnIptalEt)
                IptalEt();
            else if (e.Item == btnIptalGeriAl)
                IptalGeriAl();
            else if (e.Item == btnBelgeHareketleri)
                BelgeHareketleri();

            Cursor.Current = DefaultCursor;
        }
        protected virtual void ImageComboBox_SelectedValueChanged(object sender, EventArgs e) { }
        protected virtual void CheckEdit_CheckedChanged(object sender, EventArgs e) { }
        private void Navigator_ButtonClick(object sender, NavigatorButtonClickEventArgs e)
        {
            if (e.Button == insUpNavigator.Navigator.Buttons.Append)
                HareketEkle();
            else if (e.Button == insUpNavigator.Navigator.Buttons.Remove)
                HareketSil();

            //Append yada remove ye basınca direk olark tablo içerisinde satır ekleyip yada siliyor....burada devre dışır bıraktık ÇÜNKÜ yeni tablo açtırılıp oradan kontrol edilecek
            if (e.Button == insUpNavigator.Navigator.Buttons.Append || e.Button == insUpNavigator.Navigator.Buttons.Remove)
                e.Handled = true;
        }
        protected virtual void Tablo_CellValueChanged(object sender, CellValueChangedEventArgs e)
        {
            if (!_isLoaded) return;

            var entity = Tablo.GetRow<IBaseHareketEntity>();
            if (!entity.Insert)
                entity.Update = true;

            ButonEnableDurumu(true);
        }
        protected virtual void Tablo_MouseUp(object sender, MouseEventArgs e)
        {
            if (popupMenu == null) return;
            if (e.Button != MouseButtons.Right) return;

            btnHareketSil.Enabled = Tablo.RowCount > 0;
            btnKartDuzenle.Enabled = Tablo.RowCount > 0;
            btnIptalEt.Enabled = Tablo.RowCount > 0;
            btnIptalGeriAl.Enabled = Tablo.RowCount > 0;

            e.SagMenuGoster(popupMenu);
        }
        private void Tablo_GotFocus(object sender, EventArgs e)
        {
            var statusBarSource = sender as IStatusBarAciklama;
            var statusBarShortCutSource = sender as IStatusBarKisaYol;

            if (statusBarSource != null && statusBarShortCutSource != null)
            {
                OwnerForm.statusBarKisaYol.Visibility = BarItemVisibility.Always;
                OwnerForm.statusBarKisaYolAciklama.Visibility = BarItemVisibility.Always;

                OwnerForm.statusBarAciklama.Caption = statusBarSource.StatusBarAciklama;
                OwnerForm.statusBarKisaYol.Caption = statusBarShortCutSource.StatusBarKisaYol;
                OwnerForm.statusBarKisaYolAciklama.Caption = statusBarSource.StatusBarAciklama;
            }


            //OwnerForm.statusBarKisaYol.Visibility = BarItemVisibility.Always;
            //OwnerForm.statusBarKisaYolAciklama.Visibility = BarItemVisibility.Always;

            //OwnerForm.statusBarAciklama.Caption = ((IStatusBarKisaYol)sender).StatusBarAciklama;
            //OwnerForm.statusBarKisaYol.Caption = ((IStatusBarKisaYol)sender).StatusBarKisaYol;
            //OwnerForm.statusBarKisaYolAciklama.Caption = ((IStatusBarKisaYol)sender).StatusBarKisaYolAciklama;
        }
        private void Tablo_LostFocus(object sender, EventArgs e)
        {
            OwnerForm.statusBarKisaYol.Visibility = BarItemVisibility.Never;
            OwnerForm.statusBarKisaYolAciklama.Visibility = BarItemVisibility.Never;
        }
        private void Tablo_KeyDown(object sender, KeyEventArgs e)
        {
            switch (e.KeyCode)
            {
                case Keys.Escape:
                    if (Tablo.IsEditorFocused)
                        insUpNavigator.Navigator.Buttons.DoClick(insUpNavigator.Navigator.Buttons.CancelEdit);
                    else
                        OwnerForm.Close();
                    break;
                case Keys.Tab:
                case Keys.Left:
                case Keys.Right:
                case Keys.Up:
                case Keys.Down:
                    insUpNavigator.Navigator.Buttons.DoClick(insUpNavigator.Navigator.Buttons.EndEdit);
                    break;
                case Keys.Insert when e.Shift:
                    HareketEkle();
                    break;
                case Keys.Delete when e.Modifiers == Keys.Shift:
                    HareketSil();
                    break;
                case Keys.F3:
                    OpenEntity();
                    break;
                case Keys.T when e.Control:
                    IptalEt();
                    break;
                case Keys.R when e.Control:
                    IptalGeriAl();
                    break;
                case Keys.F6:
                    BelgeHareketleri();
                    break;
            }
        }
        protected virtual void Tablo_FocusedColumnChanged(object sender, FocusedColumnChangedEventArgs e)
        {
            var statusBarKisaYol = e.FocusedColumn as IStatusBarKisaYol;
            var statusBarAciklama = e.FocusedColumn as IStatusBarAciklama;

            if (statusBarKisaYol != null && statusBarKisaYol.StatusBarKisaYol != null)
            {
                OwnerForm.statusBarKisaYol.Visibility = BarItemVisibility.Always;
                OwnerForm.statusBarKisaYolAciklama.Visibility = BarItemVisibility.Always;

                OwnerForm.statusBarAciklama.Caption = statusBarAciklama?.StatusBarAciklama ?? string.Empty;
                OwnerForm.statusBarKisaYol.Caption = statusBarKisaYol.StatusBarKisaYol;
                OwnerForm.statusBarKisaYolAciklama.Caption = statusBarAciklama?.StatusBarAciklama ?? string.Empty;
            }
            else if (statusBarAciklama != null)
            {
                OwnerForm.statusBarAciklama.Caption = statusBarAciklama.StatusBarAciklama;
            }


            //if (OwnerForm == null) return;
            //OwnerForm.statusBarKisaYol.Visibility = BarItemVisibility.Never;
            //OwnerForm.statusBarKisaYolAciklama.Visibility = BarItemVisibility.Never;

            //if (!e.FocusedColumn.OptionsColumn.AllowEdit)
            //    Tablo_GotFocus(sender, null);

            //else if (((IStatusBarKisaYol)e.FocusedColumn).StatusBarKisaYol != null)
            //{
            //    OwnerForm.statusBarKisaYol.Visibility = BarItemVisibility.Always;
            //    OwnerForm.statusBarKisaYolAciklama.Visibility = BarItemVisibility.Always;

            //    OwnerForm.statusBarAciklama.Caption = ((IStatusBarKisaYol)e.FocusedColumn).StatusBarAciklama;
            //    OwnerForm.statusBarKisaYol.Caption = ((IStatusBarKisaYol)e.FocusedColumn).StatusBarKisaYol;
            //    OwnerForm.statusBarKisaYolAciklama.Caption = ((IStatusBarKisaYol)e.FocusedColumn).StatusBarAciklama;
            //}
            //else if (((IStatusBarKisaYol)e.FocusedColumn).StatusBarAciklama != null)
            //    OwnerForm.statusBarAciklama.Caption = ((IStatusBarKisaYol)e.FocusedColumn).StatusBarAciklama;
        }
        private void Tablo_SablonChanged(object sender, EventArgs e)
        {
            _tabloSablonKayitEdilecek = true;
            SablonKaydet();
        }
        private void Tablo_DoubleClick(object sender, EventArgs e)
        {
            OpenEntity();
        }
        private void Tablo_FocusedRowObjectChanged(object sender, FocusedRowObjectChangedEventArgs e)
        {
            SutunGizleGoster();
            RowCellAllowEdit();
        }
        protected virtual void Tablo_RowCountChanged(object sender, EventArgs e) { }

    }
}
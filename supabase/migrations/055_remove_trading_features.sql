-- 055_remove_trading_features.sql
-- Trading-spezifische Tabellen entfernen (Blueprint-Umbau)

DROP TABLE IF EXISTS public.trading_journal_trades CASCADE;
DROP TABLE IF EXISTS public.trading_journals CASCADE;
DROP TABLE IF EXISTS public.analysis_posts CASCADE;

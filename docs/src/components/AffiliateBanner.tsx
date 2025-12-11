import { useState, useEffect, useRef, useCallback } from 'react';
import yaml from 'js-yaml';

interface AdData {
  pid: number;
  size: string;
  name: string;
}

interface AffiliateData {
  quiz: AdData[];
}

const SID = '3757428'; // バリューコマースのSID
const INTERVAL = 8000; // 切り替え間隔（8秒）
const FADE_DURATION = 500; // フェード時間（0.5秒）
const PAUSE_DURATION = 30000; // 手動操作後の停止時間（30秒）

export default function AffiliateBanner() {
  const [ads, setAds] = useState<AdData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // 広告データを読み込む
  useEffect(() => {
    const loadAds = async () => {
      try {
        const response = await fetch('/how-to-use-github/data/affiliates.yaml');
        const yamlText = await response.text();
        const data = yaml.load(yamlText) as AffiliateData;
        if (data?.quiz && data.quiz.length > 0) {
          setAds(data.quiz);
          setIsLoaded(true);
        }
      } catch (error) {
        console.error('広告データの読み込みに失敗しました:', error);
      }
    };
    loadAds();
  }, []);

  // iframeに広告を描画
  const renderAd = useCallback((index: number) => {
    if (!iframeRef.current || ads.length === 0) return;

    const ad = ads[index];
    const [width, height] = ad.size.split('x').map(v => parseInt(v));
    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

    if (!iframeDoc) return;

    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          html, body {
            margin: 0;
            padding: 0;
            width: ${width}px;
            height: ${height}px;
            overflow: hidden;
            text-align: center;
            background: transparent;
          }
        </style>
      </head>
      <body>
        <script language="javascript" src="//ad.jp.ap.valuecommerce.com/servlet/jsbanner?sid=${SID}&pid=${ad.pid}"></script>
        <noscript>
          <a href="//ck.jp.ap.valuecommerce.com/servlet/referral?sid=${SID}&pid=${ad.pid}" rel="nofollow">
            <img src="//ad.jp.ap.valuecommerce.com/servlet/gifbanner?sid=${SID}&pid=${ad.pid}" border="0">
          </a>
        </noscript>
      </body>
      </html>
    `);
    iframeDoc.close();
  }, [ads]);

  // 広告を切り替える
  const switchAd = useCallback((direction: 'next' | 'prev') => {
    if (ads.length <= 1) return;

    setIsFading(true);

    setTimeout(() => {
      setCurrentIndex(prev => {
        if (direction === 'next') {
          return (prev + 1) % ads.length;
        } else {
          return (prev - 1 + ads.length) % ads.length;
        }
      });
      setIsFading(false);
    }, FADE_DURATION);
  }, [ads.length]);

  // 自動切り替えを開始
  const startAutoSwitch = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      switchAd('next');
    }, INTERVAL);
  }, [switchAd]);

  // 自動切り替えを停止
  const stopAutoSwitch = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // 手動操作後の一時停止処理
  const pauseAutoSwitch = useCallback(() => {
    stopAutoSwitch();

    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
    }

    pauseTimerRef.current = setTimeout(() => {
      startAutoSwitch();
    }, PAUSE_DURATION);
  }, [stopAutoSwitch, startAutoSwitch]);

  // 前の広告へ
  const handlePrev = () => {
    pauseAutoSwitch();
    switchAd('prev');
  };

  // 次の広告へ
  const handleNext = () => {
    pauseAutoSwitch();
    switchAd('next');
  };

  // currentIndexが変わったら広告を描画
  useEffect(() => {
    if (isLoaded && ads.length > 0) {
      renderAd(currentIndex);
    }
  }, [currentIndex, isLoaded, ads, renderAd]);

  // 自動切り替えを開始
  useEffect(() => {
    if (isLoaded && ads.length > 1) {
      startAutoSwitch();
    }

    return () => {
      stopAutoSwitch();
      if (pauseTimerRef.current) {
        clearTimeout(pauseTimerRef.current);
      }
    };
  }, [isLoaded, ads.length, startAutoSwitch, stopAutoSwitch]);

  if (!isLoaded || ads.length === 0) {
    return null;
  }

  return (
    <div className="affiliate-banner">
      <div className="affiliate-banner-wrapper">
        <div className={`affiliate-banner-container ${isFading ? 'fade-out' : ''}`}>
          <iframe
            ref={iframeRef}
            style={{
              border: 'none',
              width: '468px',
              height: '60px',
              overflow: 'hidden',
              display: 'block',
            }}
            scrolling="no"
            frameBorder="0"
          />
        </div>
        {ads.length > 1 && (
          <div className="affiliate-banner-controls">
            <button
              className="affiliate-banner-nav"
              onClick={handlePrev}
              aria-label="前の広告"
            >
              &lt;
            </button>
            <span className="affiliate-banner-indicator">
              {currentIndex + 1}/{ads.length}
            </span>
            <button
              className="affiliate-banner-nav"
              onClick={handleNext}
              aria-label="次の広告"
            >
              &gt;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

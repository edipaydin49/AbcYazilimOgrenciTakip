"""Futbol maçı video analizi: tespit, takip, takım, sahiplik, pas, diziliş, taktik ve oyuncu profilleri."""
from .core import BALL, GOALKEEPER, PLAYER, REFEREE, Detections, FrameResult
from .pipeline import MatchAnalyzer

__all__ = ["MatchAnalyzer", "Detections", "FrameResult", "BALL", "GOALKEEPER", "PLAYER", "REFEREE"]

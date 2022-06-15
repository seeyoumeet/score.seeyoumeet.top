\version "2.22.2"
\language english
\header { 
	title = "使用LilyPad制作乐谱" 
	subtitle = "副标题"
	cmposer = "罗大佑"
}

\score {
	\fixed c' {
		\clef treble
		
		\key g \major
		
		\time 4/4

		

		b4 4 2 | 4 4 2 | b4 d'4 g4. a8 | b2. r4 |
		c'4 4 4. 8 | c'4 b4  4 8 8 | b4 a a b | a2 d'4 r4 |

		b4 4 2 | 4 4 2 | b4 d'4 g4. a8 | g2. r4 |

		c'4 4 4. 8 | c'4 b4 4 8 8 | d'4 d' c' a | g2.  r4 |
	}
}
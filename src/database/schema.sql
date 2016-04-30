/****** Object:  Table [dbo].[tbl_game]    Script Date: 4/29/2016 11:07:31 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_game](
	[id] [uniqueidentifier] NOT NULL,
	[team1] [uniqueidentifier] NULL,
	[team2] [uniqueidentifier] NULL,
	[winner] [uniqueidentifier] NULL,
	[team1_score] [tinyint] NULL,
	[team2_score] [tinyint] NULL,
	[time] [datetime] NULL,
 CONSTRAINT [PK_tbl_game] PRIMARY KEY CLUSTERED
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[tbl_person]    Script Date: 4/29/2016 11:07:31 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_person](
	[id] [uniqueidentifier] NOT NULL,
	[firstname] [nvarchar](500) NULL,
	[lastname] [nvarchar](500) NULL,
	[displayname] [nvarchar](500) NOT NULL,
	[profile_id] [uniqueidentifier] NULL,
	[user_id] [uniqueidentifier] NULL
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[tbl_position]    Script Date: 4/29/2016 11:07:31 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_position](
	[id] [uniqueidentifier] NOT NULL,
	[name] [nvarchar](100) NOT NULL
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[tbl_team]    Script Date: 4/29/2016 11:07:31 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_team](
	[id] [uniqueidentifier] NOT NULL,
	[name] [nvarchar](500) NULL,
	[type] [int] NULL
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[tbl_teammember]    Script Date: 4/29/2016 11:07:31 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_teammember](
	[person_id] [uniqueidentifier] NOT NULL,
	[team_id] [uniqueidentifier] NOT NULL,
	[position_id] [uniqueidentifier] NULL,
 CONSTRAINT [PK_tbl_teammember] PRIMARY KEY CLUSTERED
(
	[person_id] ASC,
	[team_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[tbl_teamtype]    Script Date: 4/29/2016 11:07:31 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_teamtype](
	[id] [uniqueidentifier] NOT NULL,
	[name] [nvarchar](500) NULL
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[tbl_user]    Script Date: 4/29/2016 11:07:31 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_user](
	[person_id] [uniqueidentifier] NOT NULL,
	[email] [nvarchar](500) NOT NULL,
	[password] [nvarchar](128) NOT NULL,
	[password_salt] [nvarchar](128) NULL,
 CONSTRAINT [PK_tbl_user] PRIMARY KEY CLUSTERED
(
	[person_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Index [IX_tbl_game_team1]    Script Date: 4/29/2016 11:07:31 PM ******/
CREATE NONCLUSTERED INDEX [IX_tbl_game_team1] ON [dbo].[tbl_game]
(
	[team1] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_tbl_game_team2]    Script Date: 4/29/2016 11:07:31 PM ******/
CREATE NONCLUSTERED INDEX [IX_tbl_game_team2] ON [dbo].[tbl_game]
(
	[team2] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO

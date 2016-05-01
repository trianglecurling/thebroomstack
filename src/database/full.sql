USE [master]
GO
/****** Object:  Database [thebroomstack]    Script Date: 4/30/2016 11:29:01 PM ******/
CREATE DATABASE [thebroomstack]
 CONTAINMENT = NONE
 ON  PRIMARY
( NAME = N'thebroomstack', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL12.MSSQLSERVER\MSSQL\DATA\thebroomstack.mdf' , SIZE = 4096KB , MAXSIZE = UNLIMITED, FILEGROWTH = 1024KB )
 LOG ON
( NAME = N'thebroomstack_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL12.MSSQLSERVER\MSSQL\DATA\thebroomstack_log.ldf' , SIZE = 1024KB , MAXSIZE = 2048GB , FILEGROWTH = 10%)
GO
ALTER DATABASE [thebroomstack] SET COMPATIBILITY_LEVEL = 120
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [thebroomstack].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [thebroomstack] SET ANSI_NULL_DEFAULT OFF
GO
ALTER DATABASE [thebroomstack] SET ANSI_NULLS OFF
GO
ALTER DATABASE [thebroomstack] SET ANSI_PADDING OFF
GO
ALTER DATABASE [thebroomstack] SET ANSI_WARNINGS OFF
GO
ALTER DATABASE [thebroomstack] SET ARITHABORT OFF
GO
ALTER DATABASE [thebroomstack] SET AUTO_CLOSE OFF
GO
ALTER DATABASE [thebroomstack] SET AUTO_SHRINK OFF
GO
ALTER DATABASE [thebroomstack] SET AUTO_UPDATE_STATISTICS ON
GO
ALTER DATABASE [thebroomstack] SET CURSOR_CLOSE_ON_COMMIT OFF
GO
ALTER DATABASE [thebroomstack] SET CURSOR_DEFAULT  GLOBAL
GO
ALTER DATABASE [thebroomstack] SET CONCAT_NULL_YIELDS_NULL OFF
GO
ALTER DATABASE [thebroomstack] SET NUMERIC_ROUNDABORT OFF
GO
ALTER DATABASE [thebroomstack] SET QUOTED_IDENTIFIER OFF
GO
ALTER DATABASE [thebroomstack] SET RECURSIVE_TRIGGERS OFF
GO
ALTER DATABASE [thebroomstack] SET  DISABLE_BROKER
GO
ALTER DATABASE [thebroomstack] SET AUTO_UPDATE_STATISTICS_ASYNC OFF
GO
ALTER DATABASE [thebroomstack] SET DATE_CORRELATION_OPTIMIZATION OFF
GO
ALTER DATABASE [thebroomstack] SET TRUSTWORTHY OFF
GO
ALTER DATABASE [thebroomstack] SET ALLOW_SNAPSHOT_ISOLATION OFF
GO
ALTER DATABASE [thebroomstack] SET PARAMETERIZATION SIMPLE
GO
ALTER DATABASE [thebroomstack] SET READ_COMMITTED_SNAPSHOT OFF
GO
ALTER DATABASE [thebroomstack] SET HONOR_BROKER_PRIORITY OFF
GO
ALTER DATABASE [thebroomstack] SET RECOVERY FULL
GO
ALTER DATABASE [thebroomstack] SET  MULTI_USER
GO
ALTER DATABASE [thebroomstack] SET PAGE_VERIFY CHECKSUM
GO
ALTER DATABASE [thebroomstack] SET DB_CHAINING OFF
GO
ALTER DATABASE [thebroomstack] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF )
GO
ALTER DATABASE [thebroomstack] SET TARGET_RECOVERY_TIME = 0 SECONDS
GO
ALTER DATABASE [thebroomstack] SET DELAYED_DURABILITY = DISABLED
GO
EXEC sys.sp_db_vardecimal_storage_format N'thebroomstack', N'ON'
GO
USE [thebroomstack]
GO
/****** Object:  Table [dbo].[tbl_game]    Script Date: 4/30/2016 11:29:01 PM ******/
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
/****** Object:  Table [dbo].[tbl_membership]    Script Date: 4/30/2016 11:29:01 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_membership](
	[person_id] [uniqueidentifier] NOT NULL,
	[membershiptype] [nvarchar](100) NOT NULL,
	[notes] [text] NULL,
	[expiration] [smalldatetime] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
/****** Object:  Table [dbo].[tbl_membershiptype]    Script Date: 4/30/2016 11:29:01 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_membershiptype](
	[type] [nvarchar](100) NOT NULL,
	[cost] [smallmoney] NOT NULL
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[tbl_person]    Script Date: 4/30/2016 11:29:01 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_person](
	[id] [uniqueidentifier] NOT NULL,
	[firstname] [nvarchar](500) NULL,
	[lastname] [nvarchar](500) NULL,
	[displayname] [nvarchar](500) NOT NULL,
	[waiversigneddate] [date] NULL,
	[profile_id] [uniqueidentifier] NULL,
	[user_id] [uniqueidentifier] NULL,
 CONSTRAINT [PK_tbl_person] PRIMARY KEY CLUSTERED
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[tbl_position]    Script Date: 4/30/2016 11:29:01 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_position](
	[id] [uniqueidentifier] NOT NULL,
	[name] [nvarchar](100) NOT NULL
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[tbl_team]    Script Date: 4/30/2016 11:29:01 PM ******/
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
/****** Object:  Table [dbo].[tbl_teammember]    Script Date: 4/30/2016 11:29:01 PM ******/
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
/****** Object:  Table [dbo].[tbl_teamtype]    Script Date: 4/30/2016 11:29:01 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_teamtype](
	[id] [uniqueidentifier] NOT NULL,
	[name] [nvarchar](500) NULL
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[tbl_user]    Script Date: 4/30/2016 11:29:01 PM ******/
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
/****** Object:  Index [IX_tbl_game_team1]    Script Date: 4/30/2016 11:29:01 PM ******/
CREATE NONCLUSTERED INDEX [IX_tbl_game_team1] ON [dbo].[tbl_game]
(
	[team1] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_tbl_game_team2]    Script Date: 4/30/2016 11:29:01 PM ******/
CREATE NONCLUSTERED INDEX [IX_tbl_game_team2] ON [dbo].[tbl_game]
(
	[team2] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  StoredProcedure [dbo].[prc_AddMembership]    Script Date: 4/30/2016 11:29:01 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[prc_AddMembership]
	-- Add the parameters for the stored procedure here
	@membershiptype nvarchar(100),
	@person_id uniqueidentifier = null,
	@email nvarchar(500) = null,
	@notes text = null,
	@expiration smalldatetime = null
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	IF (@person_id IS NOT NULL AND @email IS NOT NULL)
		THROW 20005, 'Either specify a person ID or an email, not both.', 1;
	IF (@person_id IS NULL AND @email IS NULL)
		THROW 20006, 'Either specify a person ID or an email.', 1;

	-- If email was sent, find the person id.
	IF (@email IS NOT NULL)
	BEGIN
		SET @person_id = (SELECT [person_id] FROM tbl_user WHERE [email] = @email);

		IF (@person_id IS NULL)
			THROW 20004, 'User not found.', 1;
	END

	-- Person ID was sent. Make sure it exists.
	IF (@email IS NULL)
	BEGIN
		IF ((SELECT COUNT(*) FROM tbl_user WHERE [person_id] = @person_id) <> 1)
			THROW 20004, 'User not found.', 1;
	END

	-- Make sure the membership type exists
    IF ((SELECT COUNT(*) FROM tbl_membershiptype WHERE [type] = @membershiptype) <> 1)
		THROW 20003, 'Membership type not found.', 1;

	-- Add the new membership
	INSERT INTO
		tbl_membership ([person_id], [membershiptype], [notes], [expiration])
	VALUES (@person_id, @membershiptype, @notes, @expiration);
END

GO
/****** Object:  StoredProcedure [dbo].[prc_AddPerson]    Script Date: 4/30/2016 11:29:01 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[prc_AddPerson]
	-- Add the parameters for the stored procedure here
	@displayname nvarchar(500),
	@firstname nvarchar(500) = NULL,
	@lastname nvarchar(500) = NULL,
	@profile_id UNIQUEIDENTIFIER = NULL,
	@user_id UNIQUEIDENTIFIER = NULL,
	@id UNIQUEIDENTIFIER OUTPUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	SET @id = (SELECT NEWID());

	INSERT INTO
		tbl_person ([id], [firstname], [lastname], [displayname], [profile_id], [user_id])
	VALUES
		(@id, @firstname, @lastname, @displayname, @profile_id, @user_id);
END
GO
/****** Object:  StoredProcedure [dbo].[prc_AddPersonToTeam]    Script Date: 4/30/2016 11:29:01 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================

-- Add person to team, return the id of the team added to

--If no team or team ID, create a new team w/ no name
--If no team ID, but yes a team name
--	find teams w/ name
--	if more than one team
--		throw
--	if exactly 1
--		Add to that team
--	if 0
--		create a new team with that name

--If no position or position ID, don't set a position (null)
--If no position ID, but yes position name
--	find positions w/ name
--	if 1 position
--		use that position id
--	if 0
--		create a new position

--If no person, email, or person ID, throw an error (need a name at least)
--If no person ID, no email, but yes a person name
--	Create a new person w/ given display name and use that
--If no person ID, yes email
--	Ignore person name
--	find users w/ email
--	If 1 found
--		Use that person ID
--	If 0 found
--		throw

CREATE PROCEDURE [dbo].[prc_AddPersonToTeam]
	-- Add the parameters for the stored procedure here
	@person_id UNIQUEIDENTIFIER = NULL,
	@person_email nvarchar(500) =  NULL,
	@team_id UNIQUEIDENTIFIER = NULL,
	@position_id UNIQUEIDENTIFIER = NULL,
	@person nvarchar(500) = NULL,
	@team nvarchar(500) = NULL,
	@position nvarchar(500) = NULL
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	-- Get the team id
	IF (@team_id IS NULL AND @team IS NULL)
	BEGIN
		SET @team_id = (SELECT NEWID());
		INSERT INTO tbl_team (id) VALUES (@team_id);
	END
	IF (@team_id IS NULL AND @team IS NOT NULL)
	BEGIN
		DECLARE @matchingTeams TABLE(id UNIQUEIDENTIFIER);
		INSERT INTO @matchingTeams SELECT id FROM tbl_team WHERE name = @team;

		DECLARE @matchingCount int = (SELECT COUNT(*) FROM @matchingTeams);

		IF (@matchingCount > 1)
			THROW 200000, 'Multiple teams found matching given name', 1;
		IF (@matchingCount = 1)
			SET @team_id = (SELECT TOP 1 * FROM @matchingTeams);
		IF (@matchingCount = 0)
		BEGIN
			SET @team_id = (SELECT NEWID());
			INSERT INTO tbl_team (id, name) VALUES (@team_id, @team);
		END
	END

	-- Get the position id
	IF (@position_id IS NULL AND @position IS NOT NULL)
	BEGIN
		SET @position_id = (SELECT id FROM tbl_position WHERE name=@position);
		IF (@position_id IS NULL)
		BEGIN
			SET @position_id = (SELECT NEWID());
			INSERT INTO tbl_position (id, name) VALUES (@position_id, @position);
		END
	END

	-- Get the person id
	IF (@person_id IS NULL AND @person_email IS NULL AND @person IS NULL)
		THROW 200001, 'No person identified to add to team.', 1;
	IF (@person_id IS NULL AND @person_email IS NULL AND @person IS NOT NULL)
	BEGIN
		EXEC [dbo].[prc_AddPerson]
			@displayname = @person,
			@id = @person_id OUTPUT
	END
	IF (@person_id IS NULL AND @person_email IS NOT NULL)
	BEGIN
		SET @person_id = (SELECT person_id FROM tbl_user WHERE email=@person_email);
	END

	IF (@team_id IS NULL OR @person_id IS NULL)
		THROW 200002, 'Could not identify the person or the team to add to a team.', 1;

	-- Make sure the person isn't already on the team (allow changing positions)
	DELETE FROM tbl_teammember WHERE person_id = @person_id AND team_id = @team_id;

	INSERT INTO tbl_teammember (person_id, team_id, position_id) VALUES (@person_id, @team_id, @position_id);

	SELECT @team_id;
END

GO
/****** Object:  StoredProcedure [dbo].[prc_AddUser]    Script Date: 4/30/2016 11:29:01 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[prc_AddUser]
	-- Add the parameters for the stored procedure here
	@email nvarchar(500),
	@password nvarchar(128),
	@passwordSalt nvarchar(128),
	@firstname nvarchar(500),
	@lastname nvarchar(500),
	@displayname nvarchar(500)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	-- Add person
	DECLARE @return_value INT;
	DECLARE @person_id UNIQUEIDENTIFIER;
	EXEC	@return_value = [dbo].[prc_AddPerson]
		@displayname = @displayname,
		@firstname = @firstname,
		@lastname = @lastname,
		@id = @person_id OUTPUT;

	INSERT INTO tbl_user ([person_id], [email], [password], [password_salt]) VALUES (@person_id, @email, @password, @passwordSalt);
END

GO
USE [master]
GO
ALTER DATABASE [thebroomstack] SET  READ_WRITE
GO

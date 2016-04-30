/****** Object:  StoredProcedure [dbo].[prc_AddPersonToTeam]    Script Date: 4/29/2016 11:07:31 PM ******/
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

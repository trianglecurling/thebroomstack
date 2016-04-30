/****** Object:  StoredProcedure [dbo].[prc_AddPerson]    Script Date: 4/29/2016 11:07:31 PM ******/
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

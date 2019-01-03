IF EXISTS (SELECT * FROM dbo.sysobjects WHERE id = OBJECT_ID(N'SP_IoTComponent_Insert'))
BEGIN
DROP PROCEDURE [dbo].[SP_IoTComponent_Insert]
END;

GO

CREATE PROCEDURE [dbo].[SP_IoTComponent_Insert] (
@OrgID bigint, @TypeName nvarchar(255), @Name_L1 nvarchar(255), @Name_L2 nvarchar(255), @Name_L3 nvarchar(255), @Name_L4 nvarchar(255),
@QueueBranch_ID bigint, @ClassName nvarchar(255), @RelatedObject_ID bigint, @Identity nvarchar(255), @Address nvarchar(255), @Description nvarchar(255))
AS

BEGIN

INSERT INTO T_IoTComponent(ID, OrgID, Typename, Name_L1, Name_L2, Name_L3, Name_L4, QueueBranch_ID, ClassName, RelatedObject_ID, [Identity], Address, description)
Values(next value for IoTCounter, @OrgID, @TypeName, @Name_L1, @Name_L2, @Name_L3, @Name_L4, @QueueBranch_ID, @ClassName, @RelatedObject_ID, @Identity, @Address, @Description)

END;

GO

IF EXISTS (SELECT * FROM dbo.sysobjects WHERE id = OBJECT_ID(N'SP_IoTComponent_UpdateConfiguration'))
BEGIN
DROP PROCEDURE [dbo].[SP_IoTComponent_UpdateConfiguration]
END;

GO

CREATE PROCEDURE [dbo].[SP_IoTComponent_UpdateConfiguration] (
@ID bigint, @TypeName nvarchar(255), @Configuration nvarchar(MAX))
AS

BEGIN

UPDATE T_IoTComponent
SET Configuration = @Configuration
WHERE ID = @ID and Typename = @TypeName;

END;

GO

IF EXISTS (SELECT * FROM dbo.sysobjects WHERE id = OBJECT_ID(N'SP_IoTComponent_UpdateReported'))
BEGIN
DROP PROCEDURE [dbo].[SP_IoTComponent_UpdateReported]
END;

GO

CREATE PROCEDURE [dbo].[SP_IoTComponent_UpdateReported] (
@ID bigint, @TypeName nvarchar(255), @ReportedData nvarchar(MAX))
AS

BEGIN

UPDATE T_IoTComponent
SET ReportedData = @ReportedData
WHERE ID = @ID and Typename = @TypeName;

END;

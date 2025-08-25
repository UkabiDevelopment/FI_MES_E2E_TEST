-- Declare your variables
DECLARE @CompanyId INT = 2080;
DECLARE @UniqueIds TABLE (UniqueId INT);

-- Populate your UniqueId list
INSERT INTO @UniqueIds (UniqueId)
VALUES (3041), (3036), (3062);

-- Delete from HRLineDetails
WITH LineIdsToDelete AS (
    SELECT Id FROM HRLines 
    WHERE CompanyId = @CompanyId 
      AND UniqueId IN (SELECT UniqueId FROM @UniqueIds)
)
DELETE FROM HRLineDetails
WHERE HrLineId IN (SELECT Id FROM LineIdsToDelete);

-- Delete from HRLineProcessing
WITH LineIdsToDelete AS (
    SELECT Id FROM HRLines 
    WHERE CompanyId = @CompanyId 
      AND UniqueId IN (SELECT UniqueId FROM @UniqueIds)
)
DELETE FROM HRLineProcessing
WHERE HrLineId IN (SELECT Id FROM LineIdsToDelete);

-- Delete from ErpUpdates
WITH LineIdsToDelete AS (
    SELECT Id FROM HRLines 
    WHERE CompanyId = @CompanyId 
      AND UniqueId IN (SELECT UniqueId FROM @UniqueIds)
)
DELETE FROM ErpUpdates
WHERE HrLineId IN (SELECT Id FROM LineIdsToDelete);

DELETE FROM HRLines
WHERE CompanyId = @CompanyId and UniqueId IN (SELECT UniqueId FROM @UniqueIds);


--Insert into HRLines
INSERT INTO [dbo].[HRLines] (
    [UniqueId], [CompanyId], [DeliveryDate], [OfNumber], [CustomerCode], [CustomerName],
    [PhaseCode], [PhaseDescription], [OfLineId], [ProductCode], [ProductDescription],
    [Units], [ProductionHours], [PreparationHours], [MachineCode], [DescriptionCode],
    [Splitted], [IsDeleted], [IsModified], [IsNew], [LastUpdatedDate], [IsPlanned],
    [SplitCount], [IsDirectPlan], [IsDirectPlanError], [IsProductionHoursNull], [Finished],
    [CreatedDateTime], [LastModifiedDateTime], [Referencia], [StartDate], [EndDate],
    [Observation], [IsGroupTask], [GroupTaskTotalHours], [NumCentros]
)
VALUES
(
	3036, 2080, NULL, 1536, 4, 'VICINAY CEMVISA',
    1, 'SMBHL01TSK01', 5617, '130424', '130424 CALIBRADOR INFERIOR',
    1, 64.00, 0.00, '', '',
    0, 0, 0, 1, '2025-04-16 10:19:38.161', 0,
    0, 0, 0, 0,0,
    NULL, NULL, NULL, NULL, NULL,
    NULL, NULL, NULL,NULL
),
(
    3041, 2080, NULL, 1538, 5, 'THAISER',
    1, 'FRESADO', 5619, 701, 'SOPORTE CARRO DERECHO', 
	1,0.00, 0.00, '', '', 
	0,0, 0, 1, '2025-02-21 10:58:39.930', 0,
    0, 0, 1, 0,0,
    NULL, NULL, NULL, NULL, NULL,
    NULL, NULL, NULL,NULL
),
(
    3062, 2080, NULL, 1542, 8, 'GKN DRIVELINE LAZPIUR',
    3, 'test1', 5625, 701, 'SOPORTE CARRO DERECHO', 
	1,6.00, 0.00, 'PC-IGOR', 'PC-IGOR', 0,
    0, 0, 1, '2025-05-09 12:53:27.926', 0, 
	0, 0, 0, 0,0,
    NULL, NULL, NULL, NULL, NULL,
    NULL, NULL, NULL,NULL
);
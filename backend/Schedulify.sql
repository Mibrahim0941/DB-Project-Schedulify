---ALI MURTAZA 23L-0508
---M.IBRAHIM 23L-0521
---AREEBA NAEEM 23L-0656

USE master
GO
DROP DATABASE IF EXISTS SCHEDULIFY;
GO
DROP TABLE IF EXISTS Doctors;
DROP TABLE IF EXISTS Patients;
DROP TABLE IF EXISTS Departments;
DROP TABLE IF EXISTS Appointments;
DROP TABLE IF EXISTS TimeSlots;
DROP TABLE IF EXISTS Passwords;
DROP TABLE IF EXISTS LabTechnicians;
DROP TABLE IF EXISTS LabTests;
DROP TABLE IF EXISTS TestTimeSlots;
DROP TABLE IF EXISTS TestAppointments;

GO
CREATE DATABASE Schedulify;
GO
USE Schedulify;


    -- DEPARTMENT TABLE
    CREATE TABLE Departments(
        DeptID int IDENTITY(1,1) PRIMARY KEY,
        DeptName varchar(255) UNIQUE,
        Doc_Count int
    );
    
    -- DOCTOR TABLE
    CREATE TABLE Doctors(
        DocID int IDENTITY(1,1) PRIMARY KEY,
        DocName varchar(255),
        DocEmail varchar(255) UNIQUE CHECK (
			PATINDEX('%_%@_%._%', DocEmail) > 0  -- Ensures an '@' and '.' exist in the right places
			AND DocEmail NOT LIKE '%@%@%'        -- Prevents multiple '@' symbols
			AND DocEmail NOT LIKE '%.@%'         -- Prevents invalid ".@" sequences
			AND DocEmail NOT LIKE '%..%'         -- Prevents consecutive dots ".."
		),
        Degree varchar(255),
        Specialization varchar(255),
        Rating float,
        Fees int,
        Utilities varchar(255),
        Experience float,
        Presence bit,
        DocPFP varchar(255),
		DocCity varchar(255),
		DocCountry varchar(255) DEFAULT 'Pakistan',
        DeptID int FOREIGN KEY REFERENCES Departments(DeptID) ON DELETE CASCADE
    );

    -- PATIENT TABLE
    CREATE TABLE Patients(
        PtID int IDENTITY(1,1) PRIMARY KEY,
        PtName varchar(255),
        PHeight float,
        PWeight float,
        DOB varchar(50),
        PtEmail varchar(255) UNIQUE CHECK (
			PATINDEX('%_%@_%._%', PtEmail) > 0  -- Ensures an '@' and '.' exist in the right places
			AND PtEmail NOT LIKE '%@%@%'        -- Prevents multiple '@' symbols
			AND PtEmail NOT LIKE '%.@%'         -- Prevents invalid ".@" sequences
			AND PtEmail NOT LIKE '%..%'         -- Prevents consecutive dots ".."
		),
		
		PhoneNum char(20),
        PtPFP varchar(255),
		PtCity varchar(255),
		PtCountry varchar(255) DEFAULT 'Pakistan',
        BookedApts int
    );
    
      
    -- TIMESLOTS TABLE
    CREATE TABLE TimeSlots(
        SlotID int IDENTITY(1,1) PRIMARY KEY,
        DocID int FOREIGN KEY REFERENCES Doctors(DocID) ON DELETE CASCADE ON UPDATE CASCADE,
        TimeSlot varchar(100),
    );

	ALTER TABLE timeslots
	ADD DocID int FOREIGN KEY REFERENCES Doctors(DocID) ON DELETE CASCADE ON UPDATE CASCADE


 -- APPOINTMENTS TABLE
    CREATE TABLE Appointments(
        AptID int IDENTITY(1,1) PRIMARY KEY,
        AptDay char(10),
        AptDate Date,
        PtID int FOREIGN KEY REFERENCES Patients(PtID) ON DELETE CASCADE,
        DoctorID int FOREIGN KEY REFERENCES Doctors(DocID) ON DELETE CASCADE,
        SlotID int FOREIGN KEY REFERENCES TimeSlots(SlotID) ON DELETE CASCADE,
        Status varchar(50) DEFAULT 'Scheduled'
    );
    
    --Patient PASSWORDS TABLE
    CREATE TABLE PtPasswords(
        PassID int PRIMARY KEY IDENTITY(1,1),
        UserID int FOREIGN KEY REFERENCES Patients(PtID) ON DELETE CASCADE,
        Pass varbinary(64) NOT NULL 
	);
    

	--Doctor PASSWORDS TABLE
	CREATE TABLE DocPasswords(
        PassID int PRIMARY KEY IDENTITY(1,1),
        UserID int FOREIGN KEY REFERENCES Doctors(DocID) ON DELETE CASCADE,
        Pass varbinary(64) NOT NULL 
	);

    -- LAB TECHNICIANS TABLE
    CREATE TABLE LabTechnicians (
        TechID int IDENTITY(1,1) PRIMARY KEY,
        TechName varchar(255),
        TechEmail varchar(255) UNIQUE CHECK (
			PATINDEX('%_%@_%._%', TechEmail) > 0  -- Ensures an '@' and '.' exist in the right places
			AND TechEmail NOT LIKE '%@%@%'        -- Prevents multiple '@' symbols
			AND TechEmail NOT LIKE '%.@%'         -- Prevents invalid ".@" sequences
			AND TechEmail NOT LIKE '%..%'         -- Prevents consecutive dots ".."
		),
		Experience float,
        Specialization varchar(255),
        TechPFP varchar(255)
    );
    
    -- LAB TESTS TABLE
    CREATE TABLE LabTests (
        TestID int IDENTITY(1,1) PRIMARY KEY,
        TestName varchar(255),
        TestCategory varchar(255),
		City VARCHAR(100) NOT NULL DEFAULT 'Lahore',
		BasePrice INT NOT NULL
    );

	CREATE TABLE LabTestRevenue (
    RevenueID INT IDENTITY(1,1) PRIMARY KEY,
    TestID INT FOREIGN KEY REFERENCES LabTests(TestID),
    TestDate DATE DEFAULT GETDATE(),
    PatientCity VARCHAR(100),
    ActualPrice INT,
    BasePrice INT,
    LocationSurcharge INT,
    PatientID INT FOREIGN KEY REFERENCES Patients(PtID)
	);
  
    -- TEST TIME SLOTS TABLE
    CREATE TABLE TestTimeSlots (
        SlotID int IDENTITY(1,1) PRIMARY KEY,
        TestID int FOREIGN KEY REFERENCES LabTests(TestID),
        TimeSlot varchar(100),
    );
    
    -- TEST APPOINTMENTS TABLE
    CREATE TABLE TestAppointments (
        TestAptID int IDENTITY(1,1) PRIMARY KEY,
        AptDate Date,
        PtID int FOREIGN KEY REFERENCES Patients(PtID) ON DELETE CASCADE,
        TestID int FOREIGN KEY REFERENCES LabTests(TestID) ON DELETE CASCADE,
        TechID int FOREIGN KEY REFERENCES LabTechnicians(TechID) ON DELETE SET NULL,
        SlotID int FOREIGN KEY REFERENCES TestTimeSlots(SlotID) ON DELETE SET NULL,
		Status varchar(50) DEFAULT 'Scheduled'
    );

    --Payment TABLE
	CREATE TABLE Payments (
    PaymentID int IDENTITY(1,1) PRIMARY KEY,
    PatientID int NOT NULL FOREIGN KEY REFERENCES Patients(PtID) ,
	Amount int,
    Status varchar(20) NOT NULL DEFAULT 'Pending' 
        CHECK (Status IN ('Pending', 'Completed', 'Failed', 'Refunded'))
	);
    -- Create Admin table
	CREATE TABLE Admins (
    AdminID int DEFAULT 1 PRIMARY KEY,
    AdminName varchar(255) NOT NULL,
    AdminEmail varchar(255) UNIQUE CHECK (
        PATINDEX('%_%@_%._%', AdminEmail) > 0
        AND AdminEmail NOT LIKE '%@%@%'
        AND AdminEmail NOT LIKE '%.@%'
        AND AdminEmail NOT LIKE '%..%'
    ),
    PhoneNum char(20),
    AdminPFP varchar(255),
    IsSuperAdmin bit DEFAULT 0,
    IsActive bit DEFAULT 1
	);

	-- Admin passwords table
	CREATE TABLE AdminPasswords (
    PassID int PRIMARY KEY IDENTITY(1,1),
    AdminID int FOREIGN KEY REFERENCES Admins(AdminID) ON DELETE CASCADE,
    PassHash varbinary(64) NOT NULL,
	);
--------------------------------------------------------------------------------------------

--DATA TO POPULATE TABLES--

INSERT INTO Departments(DeptName, Doc_Count)
Values
('Laboratory' , 0),
('Cardiology', 0),
('Dermatology', 0),
('Gynaecology', 0),
('Oncology', 0),
('Dentistry',0)


INSERT INTO Doctors(DocName,DocEmail,Degree,Specialization,Rating,Fees,Utilities,Experience,Presence,DocCity,DeptID)
VALUES
('Ali','ali@oladoc.com', 'MBBS', 'Dermatology', 5, 2500, 'Acne Treatment, Micro Needling', 10, 'TRUE','Lahore',2 ),
('Areeba','areeba@oladoc.com', 'MBBS', 'Gynaecology', 3, 1000, 'C-Section, Normal Delivery', 1, 'FALSE','Lahore',3 ),
('Ibrahim','qt@oladoc.com', 'MBBS', 'Cardiology', 2, 5000, 'Angiography, ECG', 15, 'TRUE', 'Lahore', 1 )


INSERT INTO Patients(PtName,PHeight,PWeight,DOB,PtEmail,PhoneNum,PtCity, PtCountry,BookedApts)
VALUES
('Ahsan', 5.6,70, '23-june-2004', 'ahsan@gmail.com', '031xxxxxxxxx','Lahore','Pakistan', 0 ),
('Aaiza', 5.5,60, '23-july-2005', 'aaiza@gmail.com', '031xxxxxxxxx','Islamabad','Pakistan',  0 ),
('Faiq', 5.9,65, '26-November-2004', 'Faiq@gmail.com', '031xxxxxxxxx','Sialkot','Pakistan',  0 ),
('Waleed', 6,61, '23-july-2005', 'waleed@gmail.com', '031xxxxxxxxx', 'Faisalabad','Pakistan',0 ),
('Taha', 6,69, '25-july-2005', 'taha@gmail.com', '031xxxxxxxxx','Lahore','Pakistan', 0 ),
('Maryum', 5.45,60, '29-july-2004', 'maryum@gmail.com', '031xxxxxxxxx', 'Karachi','Pakistan',0 ),
('Ahmed Javed', 5.9,70, '31-march-2005', 'jav@gmail.com', '031xxxxxxxxx', 'Karachi','Pakistan',0 ),
('Bisma', 5.4,59, '23-august-2004', 'bisma@gmail.com', '031xxxxxxxxx','Lahore','Pakistan', 0 ),
('zoha', 5.8,61, '31-september-2004', 'zoha@gmail.com', '031xxxxxxxxx', 'Lahore','Pakistan',0 )


INSERT INTO TimeSlots(DocID,TimeSlot)
VALUES
(3,'10:00-10:30'),
(3,'3:00-3:30'),
(3,'4:00-4:30'),
(3,'2:00-2:30'),
(3,'23:00-23:30')

INSERT INTO TimeSlots(DocID,TimeSlot)
VALUES
(1002,'10:00-10:30'),
(1002,'3:00-3:30'),
(1002,'4:00-4:30'),
(1002,'2:00-2:30'),
(1002,'23:00-23:30')

INSERT INTO TimeSlots(DocID,TimeSlot)
VALUES
(1,'10:00-10:30'),
(1,'3:00-3:30'),
(1,'4:00-4:30'),
(1,'2:00-2:30'),
(1,'23:00-23:30')

INSERT INTO LabTechnicians(TechName,TechEmail,Experience,Specialization)
VALUES
('Muhaimin','muhaimin@oladoc.com', 1.5 , 'X_RAY'),
('asad','asad@oladoc.com', 3.5 , 'MRI');

INSERT INTO LabTests(TestName,TestCategory,BasePrice)
VALUES
('MRI','Radiology',7500),
('Blood','Pathology',3500);

INSERT INTO TestTimeSlots(TestID, TimeSlot)
VALUES
(1,'2:00-3:00'),
(2,'2:00-3:00'),
(1,'4:00-5:00'),
(1,'11:00-12:00'),
(2,'1:00-2:00')

select * from TestTimeSlots

INSERT INTO Admins (AdminName, AdminEmail, PhoneNum, IsSuperAdmin)
VALUES ('Ibrahim', 'ib@schedulify.com', '03001234567', 1);

INSERT INTO AdminPasswords (AdminID, PassHash)
VALUES (1, HASHBYTES('SHA2_256', 'Admin@123'));
--------------------------------------------------User Login------------------------------------------------------

-------------------------To check Booked Slots------------------------

Select PtName, DocName, TimeSlot
From Patients P
INNER JOIN Appointments A ON P.PtID = A.PtID
INNER JOIN Doctors D ON A.DoctorID = D.DocID
INNER JOIN TimeSlots S ON A.SlotID = S.SlotID


DECLARE @set2 int;
SET @set2 = (SELECT SlotID 
FROM TestTimeSlots 
WHERE TestID = 1 AND TimeSlot = '4:00-5:00' AND isBooked = 'FALSE')

INSERT INTO TestAppointments (PtID,TestID, TechID, SlotID, AptDate)
VALUES (1, 1, 1, @set2, GETDATE());

-- Mark the slot as booked
UPDATE TestTimeSlots 
SET isBooked = 'TRUE' 
WHERE SlotID = @set2;

---------------------------Register a Patient--------------------------------------
GO
CREATE OR ALTER PROCEDURE RegisterPatient
    @PtName VARCHAR(255),
    @PHeight FLOAT,
    @PWeight FLOAT,
    @DOB VARCHAR(50),
    @PtEmail VARCHAR(255),
    @PhoneNum CHAR(20),
    @Password VARCHAR(255),
    @PtPFP VARCHAR(255) = NULL,  -- Optional field
	@City VARCHAR(100),
	@Country VARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if email already exists
    IF EXISTS (SELECT 1 FROM Patients WHERE PtEmail = @PtEmail)
    BEGIN
        PRINT 'Error: Email already registered!';
        RETURN;
    END
    
    -- Insert new patient record
    INSERT INTO Patients (PtName, PHeight, PWeight, DOB, PtEmail, PhoneNum, PtPFP,PtCity,PtCountry, BookedApts)
    VALUES (@PtName, @PHeight, @PWeight, @DOB, @PtEmail, @PhoneNum, @PtPFP,@City,@Country, 0);
    
    -- Insert password into Passwords table
    DECLARE @NewPtID INT;
    SET @NewPtID = SCOPE_IDENTITY()
    
    -- Insert hashed password into PtPasswords table
    INSERT INTO PtPasswords (UserID, Pass)
    VALUES (@NewPtID, HASHBYTES('SHA2_256', @Password));
    PRINT 'Patient registered successfully!';
END;

----------------------- Register a doctor--------------------------------
GO
CREATE OR ALTER PROCEDURE RegisterDoctor
    @DocName VARCHAR(255),
    @DocEmail VARCHAR(255),
    @Degree VARCHAR(255),
    @Specialization VARCHAR(255),
    @Rating FLOAT,
    @Fees INT,
    @Utilities VARCHAR(255),
    @Experience FLOAT,
    @Presence BIT,
    @Password VARCHAR(255),
    @DocPFP VARCHAR(255) = NULL,  -- Optional field
	@City VARCHAR(100),
	@Country VARCHAR(100),
    @DeptID INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if email already exists
    IF EXISTS (SELECT 1 FROM Doctors WHERE DocEmail = @DocEmail)
    BEGIN
        PRINT 'Error: Email already registered!';
        RETURN;
    END
    
    -- Insert new doctor record
    INSERT INTO Doctors (DocName, DocEmail, Degree, Specialization, Rating, Fees, Utilities, Experience, Presence, DocPFP, DeptID ,DocCity,DocCountry)
    VALUES (@DocName, @DocEmail, @Degree, @Specialization, @Rating, @Fees, @Utilities, @Experience, @Presence, @DocPFP, @DeptID,@City,@Country);
    
    -- Retrieve the newly inserted Doctor's ID
    DECLARE @NewDocID INT;
    SET @NewDocID = SCOPE_IDENTITY();
    
    -- Insert hashed password into DocPasswords table
    INSERT INTO DocPasswords (UserID, Pass)
    VALUES (@NewDocID, HASHBYTES('SHA2_256', @Password));
    
    PRINT 'Doctor registered successfully!';
END;

----------------------- Book an appointment--------------------------------

CREATE OR ALTER PROCEDURE BookAppointment
    @PtID INT,
    @DocID INT,
    @TimeSlot VARCHAR(100),
    @AptDate DATE,
    @AptDay VARCHAR(10)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;

        DECLARE @SlotID INT;
        DECLARE @AlreadyBooked BIT = 0;

        -- Find the slot ID for this doctor and time
        SELECT @SlotID = SlotID
        FROM TimeSlots
        WHERE DocID = @DocID 
          AND TimeSlot = @TimeSlot;

        -- Check if slot exists
        IF @SlotID IS NULL
        BEGIN
            ROLLBACK TRANSACTION;
            RAISERROR('No such time slot exists for this doctor!', 16, 1);
            RETURN;
        END

        -- Check if this slot is already booked for this date (using Appointments table)
        SELECT @AlreadyBooked = 1
        FROM Appointments
        WHERE DoctorID = @DocID
          AND SlotID = @SlotID
          AND AptDate = @AptDate
          AND Status != 'Cancelled';

        IF @AlreadyBooked = 1
        BEGIN
            ROLLBACK TRANSACTION;
            RAISERROR('This time slot is already booked for the selected date!', 16, 1);
            RETURN;
        END

        -- Insert the appointment with provided date and day
        INSERT INTO Appointments (PtID, DoctorID, SlotID, AptDay, AptDate, Status)
        VALUES (@PtID, @DocID, @SlotID, @AptDay, @AptDate, 'Scheduled');

        -- Increment patient's booked appointments count
        UPDATE Patients
        SET BookedApts = BookedApts + 1
        WHERE PtID = @PtID;

        COMMIT TRANSACTION;
        SELECT 'Appointment booked successfully!' AS Message;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        THROW;
    END CATCH
END;
--------------BOOKING A LABTEST------------------
GO
CREATE OR ALTER PROCEDURE BookLabTest
    @PtID INT,
    @TestID INT,
    @TimeSlot VARCHAR(100),
    @AptDate DATE
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;

        -- Check if test exists
        IF NOT EXISTS (SELECT 1 FROM LabTests WHERE TestID = @TestID)
        BEGIN
            ROLLBACK;
            THROW 51000, 'Invalid test ID', 1;
        END

        -- Find available slot
        DECLARE @SlotID INT;
        SELECT @SlotID = SlotID 
        FROM TestTimeSlots 
        WHERE TestID = @TestID AND TimeSlot = @TimeSlot;

        IF @SlotID IS NULL
        BEGIN
            ROLLBACK;
            THROW 51000, 'No available test slot', 1;
        END

        -- Check for existing booking
        IF EXISTS (
            SELECT 1 
            FROM TestAppointments 
            WHERE TestID = @TestID 
            AND SlotID = @SlotID 
            AND AptDate = @AptDate
        )
        BEGIN
            ROLLBACK;
            THROW 51000, 'Selected time slot is not available', 1;
        END

        -- Create appointment
        INSERT INTO TestAppointments (PtID, TestID, SlotID, AptDate, status)
        VALUES (@PtID, @TestID, @SlotID, @AptDate, 'Scheduled');

        -- Update patient's booked count
        UPDATE Patients
        SET BookedApts = BookedApts + 1
        WHERE PtID = @PtID;

        COMMIT;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK;
        THROW;
    END CATCH
END;
---------------------------------------------------------
CREATE OR ALTER PROCEDURE CancelAppointment
    @AppointmentID INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;

        DECLARE @PatientID INT;
        DECLARE @SlotID INT;
        DECLARE @Status VARCHAR(50);

        -- Get appointment details
        SELECT @PatientID = PtID, @SlotID = SlotID, @Status = Status
        FROM Appointments
        WHERE AptID = @AppointmentID;

        -- Check if appointment exists
        IF @PatientID IS NULL
        BEGIN
            ROLLBACK TRANSACTION;
            RAISERROR('Appointment not found!', 16, 1);
            RETURN;
        END

        -- Check if already cancelled
        IF @Status = 'Cancelled'
        BEGIN
            ROLLBACK TRANSACTION;
            RAISERROR('Appointment is already cancelled!', 16, 1);
            RETURN;
        END

        -- Update appointment status to cancelled
        UPDATE Appointments 
        SET Status = 'Cancelled'
        WHERE AptID = @AppointmentID;

        -- Decrement patient's booked appointments count
        UPDATE Patients
        SET BookedApts = BookedApts - 1
        WHERE PtID = @PatientID AND BookedApts > 0;

        COMMIT TRANSACTION;
        SELECT 'Appointment cancelled successfully!' AS Message;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        THROW;
    END CATCH
END;

----------------------------------------------
CREATE OR ALTER PROCEDURE CancelLabTest
    @TestAppointmentID INT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;

        DECLARE @PatientID INT;
        DECLARE @Status VARCHAR(50);

        -- Get test appointment details
        SELECT @PatientID = PtID
        FROM TestAppointments
        WHERE TestAptID = @TestAppointmentID;

        -- Check if appointment exists
        IF @PatientID IS NULL
        BEGIN
            ROLLBACK TRANSACTION;
            RAISERROR('Test appointment not found!', 16, 1);
            RETURN;
        END

        -- Delete the test appointment
        DELETE FROM TestAppointments
        WHERE TestAptID = @TestAppointmentID;

        -- Decrement patient's booked appointments count
        UPDATE Patients
        SET BookedApts = BookedApts - 1
        WHERE PtID = @PatientID AND BookedApts > 0;

        COMMIT TRANSACTION;
        SELECT 'Lab test appointment cancelled successfully!' AS Message;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        THROW;
    END CATCH
END;

exec CancelLabTest 
@TestAppointmentID = 7
------------------See Patient's appointments--------------------------
Select P.PtName,D.DocName, S.TimeSlot, A.Status
From Patients P
INNER JOIN Appointments A ON P.PtID = A.PtID
INNER JOIN Doctors D ON A.DoctorID = D.DocID
INNER JOIN TimeSlots S ON A.SlotID = S.SlotID
Where P.PtID = 1;

-----------------See all the appointments of a doctor-------------------
Select D.DocName, S.TimeSlot,P.PtName, A.Status
From Patients P
INNER JOIN Appointments A ON P.PtID = A.PtID
INNER JOIN Doctors D ON A.DoctorID = D.DocID
INNER JOIN TimeSlots S ON A.SlotID = S.SlotID
Where D.DocID = 1;


--------------------Delete Appointment----------------------

                UPDATE Appointments 
                SET Status = 'Cancelled'
                WHERE AptID = @AppointmentID


                UPDATE Patients
                SET BookedApts = BookedApts - 1
                WHERE PtID = @PatientID AND BookedApts > 0


                UPDATE TimeSlots
                SET isBooked = 0
                FROM TimeSlots ts
                INNER JOIN Appointments a ON ts.SlotID = a.SlotID
                WHERE a.AptID = @AppointmentID


DELETE FROM Patients where ptID =11
DROP PROCEDURE RegisterPatient

---------------------- Update Patient Info----------------------

UPDATE Patients 
SET 
    PtName = @PtName, 
    PHeight = @PHeight, 
    PWeight = @PWeight, 
    DOB = @DOB, 
    PhoneNum = @PhoneNum, 
    PtPFP = @PtPFP
WHERE PtID = @PtID;

--------------------All Doctors in a Department----------------------
SELECT 
    DocID, DocName, Specialization, Rating, Fees, Experience, Presence 
FROM Doctors 
WHERE DeptID = @DeptID;


------------------------Delete User------------------------------------

-- Delete Patient
DELETE FROM Patients WHERE PtID = @PtID;
-- (CASCADE will automatically delete from PtPasswords and appointments)

-- Delete Doctor
DELETE FROM Doctors WHERE DocID = @DocID;
-- (CASCADE will automatically delete from DocPasswords and appointments)


------------------------Sort docs by rating------------------------------------

SELECT 
    DocID, DocName, Specialization, Rating, Fees 
FROM Doctors
WHERE DeptID = @DeptID
ORDER BY Rating DESC;

------------------------Sort docs in depts by fee------------------------------------

SELECT 
    DocID, DocName, Specialization, Rating, Fees 
FROM Doctors
WHERE DeptID = @DeptID
ORDER BY Fees;


------------------------Sort user by name------------------------------------

-- Doctors
SELECT * FROM Doctors ORDER BY DocName;

-- Patients
SELECT * FROM Patients ORDER BY PtName;

------------------------Top rated docs among each dept------------------------------------

WITH RankedDoctors AS (
    SELECT 
        D.DocID, D.DocName, D.Specialization, D.Rating, D.DeptID, 
        Dept.DeptName,
        ROW_NUMBER() OVER (PARTITION BY D.DeptID ORDER BY D.Rating DESC) as Rank
    FROM Doctors D
    JOIN Departments Dept ON D.DeptID = Dept.DeptID
)
SELECT DocID, DocName, Specialization, Rating, DeptID, DeptName
FROM RankedDoctors
WHERE Rank = 1;

------------------------Available slots for doctors------------------------------------


SELECT SlotID, TimeSlot 
FROM TimeSlots 
WHERE DocID = @DocID AND isBooked = 0;

------------------------Most popular doctor------------------------------------


SELECT TOP 1
    D.DocID, D.DocName, D.Specialization,
    COUNT(A.AptID) as AppointmentCount
FROM Doctors D
JOIN Appointments A ON D.DocID = A.DoctorID
GROUP BY D.DocID, D.DocName, D.Specialization
ORDER BY AppointmentCount DESC;

------------------------view patient history------------------------------------


-- Medical Appointments
SELECT 
    'Appointment' as Type,
    A.AptDate as Date,
    D.DocName as Provider,
    S.TimeSlot as Time,
    A.Status
FROM Appointments A
JOIN Doctors D ON A.DoctorID = D.DocID
JOIN TimeSlots S ON A.SlotID = S.SlotID
WHERE A.PtID = @PtID

UNION ALL

-- Lab Tests
SELECT 
    'Lab Test' as Type,
    TA.AptDate as Date,
	TA.PtID,
    LT.TestName as Provider,
    TTS.TimeSlot as Time,
    'Completed' as Status
FROM TestAppointments TA
JOIN LabTests LT ON TA.TestID = LT.TestID
JOIN TestTimeSlots TTS ON TA.SlotID = TTS.SlotID
WHERE TA.PtID = @PtID

ORDER BY Date DESC;
select * from TestAppointments
------------------------Sort patients' booked appointments by time and date------------------------------------


SELECT 
    P.PtName, A.AptDate, S.TimeSlot
FROM Appointments A
JOIN Patients P ON A.PtID = P.PtID
JOIN TimeSlots S ON A.SlotID = S.SlotID
WHERE A.PtID = @PtID
ORDER BY A.AptDate, S.TimeSlot;

------------------------revenue made by one Lab test------------------------------------


SELECT 
    LT.TestID, LT.TestName,
    COUNT(TA.TestAptID) as TestCount,
    SUM(LT.Price) as TotalRevenue
FROM LabTests LT
LEFT JOIN TestAppointments TA ON LT.TestID = TA.TestID
WHERE LT.TestID = @TestID
GROUP BY LT.TestID, LT.TestName;

------------------------lab test appointments for a specific patient------------------------------------


SELECT 
    TA.TestAptID, TA.AptDate,
    LT.TestName, LT.TestCategory,
    TTS.TimeSlot,
    Tech.TechName
FROM TestAppointments TA
JOIN LabTests LT ON TA.TestID = LT.TestID
JOIN TestTimeSlots TTS ON TA.SlotID = TTS.SlotID
LEFT JOIN LabTechnicians Tech ON TA.TechID = Tech.TechID
WHERE TA.PtID = @PtID
ORDER BY TA.AptDate DESC;


-- SELECT STATEMENTS TO VIEW TABLE DATA--


-- Add this after the other stored procedures
GO
CREATE OR ALTER PROCEDURE CalculateLabTestRevenue
    @TestID INT,
    @PatientID INT,
    @TestDate DATE
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        DECLARE @BasePrice INT;
        DECLARE @PatientCity VARCHAR(100);
        DECLARE @TestCity VARCHAR(100);
        DECLARE @LocationSurcharge INT;
        DECLARE @ActualPrice INT;

        -- Get base price and test city
        SELECT @BasePrice = BasePrice, @TestCity = City
        FROM LabTests
        WHERE TestID = @TestID;

        -- Get patient's city
        SELECT @PatientCity = PtCity
        FROM Patients
        WHERE PtID = @PatientID;

        -- Calculate location surcharge (example: 10% if different city)
        IF @PatientCity != @TestCity
            SET @LocationSurcharge = @BasePrice * 0.10;
        ELSE
            SET @LocationSurcharge = 0;

        -- Calculate actual price
        SET @ActualPrice = @BasePrice + @LocationSurcharge;

        -- Record the revenue
        INSERT INTO LabTestRevenue (
            TestID, 
            TestDate, 
            PatientCity, 
            ActualPrice, 
            BasePrice, 
            LocationSurcharge, 
            PatientID
        )
        VALUES (
            @TestID,
            @TestDate,
            @PatientCity,
            @ActualPrice,
            @BasePrice,
            @LocationSurcharge,
            @PatientID
        );

        -- Return the price details
        SELECT 
            @BasePrice AS BasePrice,
            @LocationSurcharge AS LocationSurcharge,
            @ActualPrice AS ActualPrice;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;

-- Add a view for revenue analysis
GO
CREATE OR ALTER VIEW LabTestRevenueAnalysis AS
SELECT 
    LT.TestName,
    LT.TestCategory,
    LT.City AS TestLocation,
    COUNT(LTR.RevenueID) AS TotalTests,
    SUM(LTR.ActualPrice) AS TotalRevenue,
    AVG(LTR.LocationSurcharge) AS AvgLocationSurcharge,
    COUNT(DISTINCT LTR.PatientCity) AS UniquePatientCities
FROM LabTests LT
LEFT JOIN LabTestRevenue LTR ON LT.TestID = LTR.TestID
GROUP BY LT.TestID, LT.TestName, LT.TestCategory, LT.City;

-- Add a stored procedure to get revenue by location
GO
CREATE OR ALTER PROCEDURE GetLabTestRevenueByLocation
    @City VARCHAR(100) = NULL,
    @StartDate DATE = GETDATE,
    @EndDate DATE = GETDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        LT.TestName,
        LT.TestCategory,
        LTR.PatientCity,
        COUNT(LTR.RevenueID) AS TestCount,
        SUM(LTR.ActualPrice) AS TotalRevenue,
        AVG(LTR.LocationSurcharge) AS AvgLocationSurcharge
    FROM LabTestRevenue LTR
    JOIN LabTests LT ON LTR.TestID = LT.TestID
    WHERE (@City IS NULL OR LTR.PatientCity = @City)
    AND (@StartDate IS NULL OR LTR.TestDate >= @StartDate)
    AND (@EndDate IS NULL OR LTR.TestDate <= @EndDate)
    GROUP BY LT.TestName, LT.TestCategory, LTR.PatientCity
    ORDER BY TotalRevenue DESC;
END;



-----------VIEW FOR MOST POPULAR DOC-------------
CREATE VIEW mostPopularDoctor AS
SELECT TOP 1
D.DocID, D.DocName, D.Specialization,
COUNT(A.AptID) as AppointmentCount
FROM Doctors D
JOIN Appointments A ON D.DocID = A.DoctorID
GROUP BY D.DocID, D.DocName, D.Specialization
ORDER BY AppointmentCount DESC


-----------GET APPOINTMENT DETAILS OF PATIENTS/Doctors----------
CREATE or ALTER VIEW AppointmentDetails AS
Select P.PtID, P.PtName,D.DocID, D.DocName, S.TimeSlot, A.Status, A.AptDate
From Patients P INNER JOIN Appointments A ON P.PtID = A.PtID 
INNER JOIN Doctors D ON A.DoctorID = D.DocID 
INNER JOIN TimeSlots S ON A.SlotID = S.SlotID

----------RankedDoctors----------------
CREATE VIEW RankedDoctors AS 
SELECT D.DocID, D.DocName, D.Specialization, D.Rating, D.DeptID, Dept.DeptName, ROW_NUMBER() OVER (PARTITION BY D.DeptID ORDER BY D.Rating DESC) as Rank
FROM Doctors D
JOIN Departments Dept ON D.DeptID = Dept.DeptID

            SELECT DocID, DocName, Specialization, Rating, DeptID, DeptName
            FROM RankedDoctors
            WHERE Rank = 1

-- Admin Login
GO
CREATE OR ALTER PROCEDURE AdminLogin
    @Email VARCHAR(255),
    @Password VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @HashedPassword VARBINARY(64) = HASHBYTES('SHA2_256', @Password);
    DECLARE @AdminID INT;
    
    SELECT @AdminID = 1
    FROM Admins A
    JOIN AdminPasswords AP ON A.AdminID = AP.AdminID
    WHERE A.AdminEmail = @Email 
      AND AP.PassHash = @HashedPassword
      AND A.IsActive = 1;
    -- Return admin info (without sensitive data)
    SELECT 
        AdminID,
        AdminName,
        AdminEmail,
        IsSuperAdmin
    FROM Admins
    WHERE AdminID = @AdminID;
END;
GO

-------Add Department--------
CREATE OR ALTER PROCEDURE AddDepartment
    @DeptName VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        -- Check if department already exists
        IF EXISTS (SELECT 1 FROM Departments WHERE DeptName = @DeptName)
        BEGIN
            RAISERROR('Department already exists!', 16, 1);
            RETURN;
        END
        
        -- Insert new department
        INSERT INTO Departments (DeptName, Doc_Count)
        VALUES (@DeptName, 0);
        
        SELECT 'Department added successfully!' AS Message;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;

-----Remove Department
CREATE OR ALTER PROCEDURE RemoveDepartment
    @DeptID INT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        -- Check if department exists
        IF NOT EXISTS (SELECT 1 FROM Departments WHERE DeptID = @DeptID)
        BEGIN
            RAISERROR('Department does not exist!', 16, 1);
            RETURN;
        END
        
        -- Delete department (CASCADE will handle related doctors)
        DELETE FROM Departments WHERE DeptID = @DeptID;
        
        SELECT 'Department removed successfully!' AS Message;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;

------see all departments
CREATE OR ALTER PROCEDURE GetAllDepartments
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        DeptID,
        DeptName,
        Doc_Count AS DoctorCount
    FROM Departments
    ORDER BY DeptName;
END;

-----Add a new lab test
CREATE OR ALTER PROCEDURE AddLabTest
    @TestName VARCHAR(255),
    @TestCategory VARCHAR(255),
    @BasePrice INT,
    @City VARCHAR(100) = 'Lahore'
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        -- Check if test already exists
        IF EXISTS (SELECT 1 FROM LabTests WHERE TestName = @TestName AND TestCategory = @TestCategory)
        BEGIN
            RAISERROR('Lab test already exists in this category!', 16, 1);
            RETURN;
        END
        
        -- Insert new lab test
        INSERT INTO LabTests (TestName, TestCategory, BasePrice, City)
        VALUES (@TestName, @TestCategory, @BasePrice, @City);
        
        SELECT 'Lab test added successfully!' AS Message;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;

----remove a lab test
CREATE OR ALTER PROCEDURE RemoveLabTest
    @TestID INT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        -- Check if test exists
        IF NOT EXISTS (SELECT 1 FROM LabTests WHERE TestID = @TestID)
        BEGIN
            RAISERROR('Lab test does not exist!', 16, 1);
            RETURN;
        END
        
        -- Delete test (CASCADE will handle related time slots and appointments)
        DELETE FROM LabTests WHERE TestID = @TestID;
        
        SELECT 'Lab test removed successfully!' AS Message;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;


SeLECT * FrOM LabTestRevenue
delete from LabTestRevenue
delete from TestAppointments

SELECT * FROM Doctors;
SELECT * FROM PtPasswords;
SELECT * FROM DocPasswords;
select * FROM Appointments
SELECT * FROM Patients;
SELECT * FROM TimeSlots;
SELECT * FROM AppointmentDetails;
SELECT * FROM Departments;
SELECT * FROM LabTechnicians;
SELECT * FROM LabTests;
SELECT * FROM TestTimeSlots;
SELECT * FROM TestAppointments;

SELECT 
                'Appointment' as Type,
                A.AptDate as Date,
                D.DocName as Doctor,
                S.TimeSlot as Time,
                A.Status
            FROM Appointments A
            JOIN Doctors D ON A.DoctorID = D.DocID
            JOIN TimeSlots S ON A.SlotID = S.SlotID
            WHERE A.PtID =1
            
            UNION ALL
            
            -- Lab Tests
            SELECT 
                'Lab Test' as Type,
                TA.AptDate as Date,
                LT.TestName as LabTech,
                TTS.TimeSlot as Time,
                TA.status as Status -- Assuming lab tests are always completed
            FROM TestAppointments TA
            JOIN LabTests LT ON TA.TestID = LT.TestID
            JOIN TestTimeSlots TTS ON TA.SlotID = TTS.SlotID
            WHERE TA.PtID = 1


			SELECT 
    ts.SlotID,
    ts.DocID,
    ts.TimeSlot,
    CASE 
        WHEN a.AptID IS NOT NULL THEN 1 
        ELSE 0 
    END AS isBooked
FROM TimeSlots ts
LEFT JOIN Appointments a ON ts.SlotID = a.SlotID
where DocID = 1

update Patients
set PtPFP = 'https://cdn.corenexis.com/i/d/ap14/XqF9mU.jpg?token=a8cdef7dcd135fcd642aefa0137de654'
where PtID = 1

https://tse1.mm.bing.net/th/id/OIP.Fnhf02zEzYZ78owW4tq4NAHaHa?rs=1&pid=ImgDetMain

UPDATE Doctors
set DocPFP = 'https://cdn.corenexis.com/i/d/ap14/TDVgiy.jpg?token=7d7bfd89cc89cddd795255e73afa7856'
where DocID = 3

Delete from Doctors
where DocID = 3

Delete from TimeSlots
Where DocID = 3

DELETE FROM Doctors WHERE DocID = 1003


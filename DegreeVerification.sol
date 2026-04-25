// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title DegreeVerification
 * @dev Smart contract for issuing and verifying university degrees.
 */
contract DegreeVerification {
    address public universityAdmin;
    uint256 public totalDegreesIssued;

    struct Degree {
        string studentName;
        string courseName;
        string university;
        string issueDate;
        bool isValid;
    }

    // Mapping from unique degree hash ID to Degree details
    mapping(bytes32 => Degree) private degrees;

    // Event emitted when a degree is issued
    event DegreeIssued(bytes32 indexed degreeId, string studentName, string courseName);

    modifier onlyAdmin() {
        require(msg.sender == universityAdmin, "Only the university admin can perform this action");
        _;
    }

    constructor() {
        universityAdmin = msg.sender;
    }

    /**
     * @dev Issue a new degree
     */
    function issueDegree(
        string memory _studentName,
        string memory _courseName,
        string memory _university,
        string memory _issueDate
    ) public onlyAdmin returns (bytes32) {
        totalDegreesIssued++;
        
        // Generate a unique ID using block timestamp and total count to ensure uniqueness
        bytes32 degreeId = keccak256(
            abi.encodePacked(_studentName, _courseName, _university, _issueDate, block.timestamp, totalDegreesIssued)
        );

        require(!degrees[degreeId].isValid, "Degree ID already exists!");

        degrees[degreeId] = Degree({
            studentName: _studentName,
            courseName: _courseName,
            university: _university,
            issueDate: _issueDate,
            isValid: true
        });

        emit DegreeIssued(degreeId, _studentName, _courseName);
        return degreeId;
    }

    /**
     * @dev Verify a degree using its unique ID
     */
    function verifyDegree(bytes32 _degreeId) public view returns (
        string memory studentName,
        string memory courseName,
        string memory university,
        string memory issueDate,
        bool isValid
    ) {
        require(degrees[_degreeId].isValid, "Degree does not exist or is invalid");
        
        Degree memory deg = degrees[_degreeId];
        return (deg.studentName, deg.courseName, deg.university, deg.issueDate, deg.isValid);
    }
}

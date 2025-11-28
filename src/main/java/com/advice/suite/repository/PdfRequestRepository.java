package com.advice.suite.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.advice.suite.entity.PdfRequest;

@Repository
public interface PdfRequestRepository extends JpaRepository<PdfRequest, Long> {
    List<PdfRequest> findByApprovedFalse();
    List<PdfRequest> findByStatus(String status);

}

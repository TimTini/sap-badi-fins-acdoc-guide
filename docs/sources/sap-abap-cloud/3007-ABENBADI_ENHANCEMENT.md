---
title: "Enhancements Using BAdIs"
url: "https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENBADI_ENHANCEMENT.html"
object: "ABENBADI_ENHANCEMENT"
final_url: "https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENBADI_ENHANCEMENT.html"
status_code: 200
fetched_at: "2026-05-02T09:35:08+00:00"
toc_path:
  - "ABAP - Keyword Documentation"
  - "ABAP Programming Language"
  - "ABAP - Enhancements"
  - "Enhancements Using BAdIs"
---

# Enhancements Using BAdIs

*Source:* [https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENBADI_ENHANCEMENT.html](https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABENBADI_ENHANCEMENT.html)

BAdIs are part of the enhancements made available by the ABAP Enhancement Framework. BAdIs, together with their calling positions in ABAP programs, form explicit enhancement options of these programs and are assigned to enhancement spots.

If BAdIs and their calling positions are defined in a system, enhancements can be made in follow-on systems by creating BAdI implementations in these systems. A BAdI implementation consists mainly of a BAdI implementation class whose instances enhance the functions of an ABAP program at runtime in the form of an object plug-in. In the ABAP Enhancement Framework, a BAdI implementation is an enhancement implementation element and is administrated by enhancement implementations.

A BAdI consists mainly of a BAdI interface that contains the declaration of BAdI methods, and a set of filters. The filters enable certain BAdI implementations to be selected for use. The following settings can be made in the definition of a BAdI, in addition to the selection of the BAdI interface:

BAdIs of the ABAP Enhancement Framework are supported by the ABAP runtime framework by the following ABAP statements:

The BAdIs of the ABAP Enhancement Framework are also freely switchable using switches from the Switch Framework.

- Whether a BAdI is intended for single or multiple use. If a BAdI is intended for single use, only a single BAdI implementation can be used in an internal session, and one BAdI implementation must be available for each use.

- A fallback BAdI implementation class can be specified to be used if no BAdI implementation matches the filter conditions.

- A BAdI can be defined as context-free or context-dependent. This setting controls the instantiation of the object plug-ins. In context-free BAdIs, it is possible to define whether an object plug-in can be created only once or multiple times within an internal session. In context-dependent BAdIs, the object plug-ins are linked with a context object.

- `GET BADI`

- Creates a BAdI object as a handle for object plug-ins.

- `CALL BADI`

- Calls BAdI methods in object plug-ins.

- For a BAdI that is intended for single use, it is best to always specify a fallback implementation class and to implement it in the same system as the BAdI.

- The implementation of the BAdI methods of a BAdI interface can be made optional, like any other interface method, by using the addition `DEFAULT`.

- See also the documentation Enhancement Framework in SAP Help Portal.

abenabap.html

abenabap_reference.html

abenenhancement_framework.html

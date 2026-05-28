---
title: "CALL BADI"
url: "https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABAPCALL_BADI.html"
object: "ABAPCALL_BADI"
final_url: "https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABAPCALL_BADI.html"
status_code: 200
fetched_at: "2026-05-02T09:35:08+00:00"
toc_path:
  - "ABAP - Keyword Documentation"
  - "ABAP Programming Language"
  - "ABAP - Enhancements"
  - "Enhancements Using BAdIs"
  - "CALL BADI"
---

# CALL BADI

*Source:* [https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABAPCALL_BADI.html](https://help.sap.com/doc/abapdocu_cp_index_htm/CLOUD/en-US/ABAPCALL_BADI.html)

```text
CALL BADI \{ badi->meth parameter_list\ \}\
|\ \{ badi->(meth_name) \{parameter_list\
|parameter_tables\}\ \}.
```

Calls a BAdI method. The statement has a static and a dynamic variant. In both variants, a BAdI reference variable must be specified for `badi`.

With respect to the addressing of BAdI methods, the BAdI reference variable behaves statically as well as dynamically like an interface reference variable with the static type of the affected BAdI interface. A BAdI method that is declared as a component of the corresponding BAdI interface is addressed directly using its name. BAdI methods declared in component interfaces of the BAdI interface can be addressed using the interface component selector or any alias names.

The additions `parameter_list` or `parameter_tables` assign actual parameters to the formal parameters of the BAdI method or handle non-class-based exceptions exactly as described in the method call. The exceptions that can occur in dynamic accesses are also the same as those of `CALL METHOD`.

The statement `CALL BADI` calls the specified method in all object plug-ins to which the BAdI object referenced by the `badi` refers.

If a method is added to a BAdI afterwards, it may be missing in a BAdI implementation. In this case the call is executed as if the method existed with an empty implementation. Actual parameters that are bound to `EXPORTING` or `RETURNING` parameters passed by value are initialized. All other actual parameters remain unchanged.

With a regular method call, the system field `sy-subrc` is either set to 0 or, when handling non-class-based exceptions, it is set to the value specified after `EXCEPTIONS`.

`CX_BADI_INITIAL_REFERENCE`

`CX_SY_DYN_CALL_ILLEGAL_METHOD`

- In the static variant, a BAdI reference variable of the static type of a concrete BAdI class must be specified for `badi`, and for `meth` a BAdI method of the corresponding BAdI must be specified directly.

- In the dynamic variant, a BAdI reference variable of the static type of the abstract superclass `CL_BADI_BASE` must be specified for `badi`. For `meth_name`, a character-like data object must be specified that must contain the name of a BAdI method in uppercase letters when the statement is executed.

- If the BAdI is defined for single use, `badi` must contain a valid BAdI reference for a static BAdI call. If `badi` is initial, a catchable exception is raised.

- If the BAdI is defined for multiple use, `badi` must contain a valid BAdI reference for a static BAdI call or can be initial. If the referenced BAdI object refers to multiple object plug-ins, the call order is the same for every `CALL BADI` statement. The exact call order can be determined in the definition of the associated BAdI implementations. If the referenced BAdI object does not reference object plug-ins, or the `badi` is initial, the statement has no effect.

- In a dynamic BAdI call, a catchable exception is always raised if there is an invalid BAdI reference in `badi`.

- BAdI objects and BAdI references can only be created using the statement `GET BADI`.

- The call of a BAdI method of a BAdI defined for single use behaves like a method call with `meth( ...)`: the called method must exist. In contrast, calls of a BAdI method defined for multiple use are more like raising an event using `RAISE EVENT`: One or more methods can exist, or no methods at all.

- The addition `DEFAULT` can be used when defining a BAdI method in a BAdI interface to define the behavior for methods that are not implemented.

- *Cause:* The reference variable `badi` is initial either for the static call, although the BAdI was defined for single use, or for the dynamic call.

- *Cause:* Method does not exist at the dynamic call
*Runtime error:*\ `DYN_CALL_METH_NOT_FOUND`

abenabap.html

abenabap_reference.html

abenenhancement_framework.html

abenbadi_enhancement.html

# Developer gameplay guide — spoilers

This guide reveals the entire first-act route and recovered identifier.

## What the player deduces

Service 006 remains active despite retirement approval dated 2001-09-18. A normal transfer receipt is absent. The transfer ledger preserves prefix **MX-91**. The independent repair notes preserve destination slot **006-R**. Together they reconstruct **MX-91/006-R**. Recovery restores a receipt whose closure was withheld and reveals partial authorization **0417**. The restored record also lists a legacy communications dependency; no later-act explanation is supplied.

## Terminal route

```text
HELP
STATUS
RECOVER ARCHIVE 006
DIR
CD OPERATIONS
OPEN "SERVICE_REGISTER.DAT"
SEARCH 006
OPEN /ARCHIVE/TRANSFER_LEDGER_2001.LOG
OPEN /ARCHIVE/INDEX_REPAIR_NOTES.TXT
HELP RECOVER
RECOVER ARCHIVE 006
OPEN /ARCHIVE/RECOVERED_006.FRAG
```

The first recovery attempt should deny authorization with useful missing-source references. Read the fragment, then select **END OF PROTOTYPE / SESSION REPORT** inside it. **REVIEW RECORDS** leaves the session usable. A second recovery command reports that recovery has already occurred and adds no operational side effects.

## Mouse route

Restore the terminal using its title-bar control. Click **OPERATIONS** on the desktop, then the register. Open **FILE INDEX**, return to the root directory, then browse **ARCHIVE**. Inspect the ledger and repair notes. Use the terminal to enter `RECOVER ARCHIVE 006` and open the new fragment. Open-document tabs let you compare records. Window title bars expose focusable controls, and close buttons remove only the window, not the discovery.

## Question-led route

Ask **“Why is service six still running?”**, then **“Wasn't it retired?”** and **“Where is its archive?”**. Follow the document pointers, or ask **“Show me the transfer ledger”** and **“Can I see the repair notes?”**. Ask **“How can I recover it?”**; the authored response describes any missing corroboration, or shows the command when ready. Execute the command deliberately and inspect the recovered record. No question triggers the recovery automatically.

Questions such as **“Who approved that?”** resolve only with clear service context; without it they request clarification. A request for unrelated topics returns supported query suggestions.

## Evidence and prerequisites

| Stable ID | Legitimate discovery routes |
| --- | --- |
| `EV_SERVICE_ACTIVE` | `STATUS`, register, status journal, authored service-status answer |
| `EV_RETIREMENT_APPROVED` | Register, administrative approval, authored retirement/status answer |
| `EV_TRANSFER_MISSING` | Inspect transfer ledger; includes prefix MX-91 |
| `EV_REPAIR_REFERENCE` | Inspect index repair notes; includes slot 006-R |
| `EV_AUTHORIZATION` | Inspect administrative authorization; supplemental evidence |
| `EV_RECOVERED_FRAGMENT` | Inspect the fragment after successful recovery |
| `KN_RECOVERY_REFERENCE` | Derived from transfer ledger plus independent repair evidence |
| `CAP_ARCHIVE_RECOVERY` | Derived from reconstructed reference, active-service evidence, and approved retirement |

All four required evidence facts can be discovered in any order. Administrative signatory evidence and reading the recovery help file are useful but not mandatory gates. Search snippets do not count as inspecting the original independent sources.

## Human playtest checklist

- Start in a fresh profile without an AI download. Confirm no later-act names appear.
- Skip and also try the normal connection sequence on separate sessions.
- Run `HELP`, `STATUS`, and **“Why is service six still running?”**.
- Attempt recovery early and inspect the denial.
- Explore both desktop icons and terminal paths, including `CD ..` and quoted filenames.
- Find the retirement approval and absent receipt, then reconstruct the two-part reference.
- Complete recovery and inspect 0417. Open and dismiss the session report.
- Repeat recovery; verify no duplicate effects.
- Reload, choose **RESUME SESSION**, and verify documents, evidence, recovery, and completion.
- Clear the scrollback; progress should remain.
- Reset with confirmation, then replay in a different discovery order.
- Repeat at a narrow viewport using all three workspace tabs and open-record tabs.
- Test reduced motion, CRT disabled, font scaling, keyboard history, and dialog Escape behavior.
- Test production offline after the initial service-worker cache has finished. Browser eviction or private sessions may remove persistence.
- Browser AI cannot be tested in this build. Ollama needs a real separately running daemon and model.

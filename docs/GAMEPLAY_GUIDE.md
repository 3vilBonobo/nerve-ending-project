# Developer gameplay guide — spoilers

The player enters an unattended records terminal. A switchboard notice shows an unanswered call to the night desk. The office notice dates the end of telephone reception to 18 September 2001; the call was retried in November 2003.

## Source records

- Unanswered call: current call status, original date, an unlisted confirmation source, and an attachment reference.
- Office notice: a closure announcement explaining why the records remain online.
- Last shift: an employee message about a removed phone and unwanted calls to their home.
- Service 006: current monitor data, without administrative conclusions.
- Closure list: the old office record marking the service closed.
- Restart log: an unattended restart because the handover remained open.
- Handover receipt: metadata for an unavailable original, with an ordinary local-backup action.
- Receipt — backup copy: an accepted transfer, a confirmation from COMMS/BRIDGE-02 rather than the night desk, partial authorisation 0417, and a preservation hold.

The records do not explain the later story. No full staff identity can be recovered in this preview. There is no deliberate communication from the hidden later-act character.

## Interaction routes

Mouse: open Unanswered call, follow its attached Handover receipt, and select READ BACKUP COPY. Other records can be read before or after. Opening the backup first is permitted; the software does not test what the reader has inspected.

Questions: Who is calling? Who is supposed to answer? Is anyone there? What is 006? Where is the receipt? These return factual answers and source links. An explicit Read the backup loads it; asking whether a copy exists does not.

Commands: OPEN Unanswered call, OPEN Handover receipt, OPEN backup. RECOVER ARCHIVE 006 remains a compatibility alias for the same read operation. General help never teaches this exact command.

Each record opens once in a document window. Attached-record links and the backup control remain outside the scrolling body. There is no duplicate body in the terminal.

## Consequences

Reading the backup makes the receipt available and registers its legacy references once. It does not stop the service, complete the handover, create a real network connection, or resolve the later story. Repeated reads do not duplicate effects. Reading the receipt marks this slice complete; the reader chooses when to open SESSION STATUS.

Evidence IDs are observations for continuity, not prerequisites. The old independent-prefix and slot rules are removed. No progression requirement depends on exact phrasing, command counts or a reading sequence.

## Human playtest questions

Watch a fresh reader without supplying the investigation:

- What do they think is happening after the first screen?
- Do they choose a source or ask a question without prompting?
- What missing detail do they care about, and why?
- Does reading the backup feel like a normal computer operation?
- Can they distinguish the office record, live monitor and saved confirmation?
- Where do they lose interest, miss a control, or repeat a question?

An automated route establishes reachability, not interest or tension. Adjust from observed human play rather than adding procedural gates to lengthen the opening.

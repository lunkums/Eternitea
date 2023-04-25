/**
 * A collection of utility methods allowing for the deferred processing of input (as opposed to the typical way of
 * dealing with input in JavaScript, using the observer pattern).
 *
 * This namespace makes heavy use of actions, which are mappings between human-readable names and keyboard key strings
 * (i.e. "a", "Shift", ";") that allow users to check the state of a key at any point in time.
 */
namespace Input {
    addEventListener("keydown", onKeyDown);
    addEventListener("keyup", onKeyUp);
    addEventListener("focus", resetActionStates);
    addEventListener("blur", resetActionStates);

    let actionMap: Map<string, string> = new Map<string, string>();
    let actionStates: Map<string, ActionState> = new Map<string, ActionState>();
    let isInputCaseSensitive: boolean = false;

    /**
     * The current state of an action.
     */
    enum ActionState {
        NONE = 0,
        UP = 1,
        DOWN = 2,
    }

    /**
     * Initialize the input handler with a new set of action mappings.
     * @param actionMap The mapping between unique string identifiers and keyboard keys.
     * @param caseSensitiveInput Whether separate action states should be stored for the same key while "Shift" is held
     * down (i.e. "A" vs "a").
     */
    export function initialize(actionMap: object, caseSensitiveInput: boolean = false): void {
        isInputCaseSensitive = caseSensitiveInput;
        Object.entries(actionMap).forEach((value, index) => {
            let actionName: string = value[0];
            let key: string = value[1];
            addAction(actionName, key);
        });
    }

    export function addAction(actionName: string, key: string): void {
        if (!isInputCaseSensitive) {
            key = capitalizeFirstLetter(key);
        }
        if (actionMap.has(actionName)) {
            console.error(`Input already recognizes action: ${actionName}`);
            return;
        }
        if (actionStates.has(key)) {
            console.error(`Input already recognizes key: ${key}`);
            return;
        }
        actionMap.set(actionName, key);
        actionStates.set(key, ActionState.UP);
    }

    export function isActionUp(actionName: string): boolean {
        return getActionStateFromName(actionName) === ActionState.UP;
    }

    export function isActionDown(actionName: string): boolean {
        return getActionStateFromName(actionName) === ActionState.DOWN;
    }

    /**
     * Helper methods
     */

    function getActionStateFromName(actionName: string): ActionState {
        if (!actionMap.has(actionName)) {
            console.error(`Input doesn't recognize action: ${actionName}`);
            return ActionState.NONE;
        }
        return actionStates.get(actionMap.get(actionName));
    }

    function setActionStateFromKey(key: string, actionState: ActionState) {
        if (!isInputCaseSensitive) {
            key = capitalizeFirstLetter(key);
        }
        if (!actionStates.has(key)) {
            return;
        }
        actionStates.set(key, actionState);
    }

    function capitalizeFirstLetter(s: string): string {
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

    /**
     * Event listeners
     */

    function onKeyDown(this: Window, ev: KeyboardEvent) {
        setActionStateFromKey(ev.key, ActionState.DOWN);
    }

    function onKeyUp(this: Window, ev: KeyboardEvent) {
        setActionStateFromKey(ev.key, ActionState.UP);
    }

    function resetActionStates(this: Window, ev: FocusEvent): void {
        for (const [key, value] of actionStates) {
            setActionStateFromKey(key, ActionState.UP);
        }
    }
}

export { Input };

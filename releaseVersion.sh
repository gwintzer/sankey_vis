# set your token
#export GITHUB_TOKEN=...

USER=$USER
REPO=$(basename $PWD)
BUILD_VERSION="1"
SKIP_INSTALL_DEPS="false"

# get the params
while getopts b:k:u:s option
do
    case "${option}"
    in
        b) BUILD_VERSION=${OPTARG};;
        k) KIBANA_VERSION=${OPTARG};;
        u) USER=${OPTARG};;
        s) SKIP_INSTALL_DEPS="true"
    esac
done

# Check kibana version
if [ -z ${KIBANA_VERSION} ]; then 
    echo -e "Options: -k <Kibana version> (mandatory)" 
    echo -e "         -b <Build increment> (default to 1)" 
    echo -e "         -u <User to log in Artifactory> (default to \$USER)" 
    echo -e "         -s for skip dependencies install (default install deps)" 
    exit; 
fi

TAG_NAME=${KIBANA_VERSION}-${BUILD_VERSION}
TAG_NAME_LATEST=${KIBANA_VERSION}-latest

# Install (or not) dependencies
echo
if [ "${SKIP_INSTALL_DEPS}" = "false" ]; then 
    echo "Install Kibana dependencies..."
    echo 
    yarn kbn bootstrap 
else
    echo "Skip installing Kibana dependencies..."
fi

# Build packages
echo
echo "Build Kibana plugin package..."
echo
yarn build -b ${TAG_NAME} -k ${KIBANA_VERSION}

echo
echo "Create a package copy as latest..."
echo
echo "cp build/${REPO}-${TAG_NAME}.zip build/${REPO}-${TAG_NAME_LATEST}.zip"
cp build/${REPO}-${TAG_NAME}.zip build/${REPO}-${TAG_NAME_LATEST}.zip


# Create tag and release

echo
echo "Create Git tag for the new release"
git tag -m "update to version ${KIBANA_VERSION} : Get uploaded artifacts in artifactory https://sfy-metriks-registry-prod.af.multis.p.fti.net/sfy-idem_generic_estack/kibana/plugins/sankey_vis" ${KIBANA_VERSION} && git push --tags



# Artifactory publish section

AF_REPO_FOR_ES="https://sfy-metriks-registry-prod.af.multis.p.fti.net/sfy-idem_generic_estack/kibana/plugins" # verifier si path OK !

PLUGINS=(
    "sankey_vis" "sankey_vis-${KIBANA_VERSION}-latest.zip" ""
    "sankey_vis" "sankey_vis-${KIBANA_VERSION}-${BUILD_VERSION}.zip" ""
)

if [ -z "$USER" ] 
then
    echo "*** Error: variable USER is not set." >&2
    exit 1
fi

echo -n LDAP Password:
read -s password
echo

function upload() {
  for index in $(seq 0 3 $(( ${#PLUGINS[@]} - 3 ))); do
    src="./build/${PLUGINS[$(( $index + 1 ))]}"
    if [[ -f "${src}" ]]; then
      curl -kL -u "${USER}:${password}" -T "${src}" "${AF_REPO_FOR_ES}/${PLUGINS[$index]}/${PLUGINS[$(( $index + 1 ))]}"
    else
      echo "WARNING: Plugin '${src}' doesn't exists"
    fi
  done
}

upload
